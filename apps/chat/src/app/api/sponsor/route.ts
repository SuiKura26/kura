import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { fromBase64, fromHex } from "@mysten/sui/utils";

const RPC_URL = "https://fullnode.testnet.sui.io:443";

const SPONSOR_SECRET_KEY = process.env.SPONSOR_SECRET_KEY || "";
const FAUCET_PACKAGE_ID = process.env.NEXT_PUBLIC_FAUCET_PACKAGE_ID || "0xdeb1b208f5373f4629b7fb2d646f3a728df82e9506783d62955fa2c789886aad";
const FAUCET_ID = process.env.NEXT_PUBLIC_FAUCET_ID || "0x60d573501df2c5df6b51ca207123871f095bfbcfa9380d0c54061211490a338e";

const MAX_GAS_BUDGET = 50_000_000;

interface SponsorRequest {
  action: "claim_usdc";
  userAddress: string;
}

function parseSecretKey(raw: string): Uint8Array {
  if (!raw) return new Uint8Array(0);
  if (raw.startsWith("suiprivkey")) {
    return fromBase64(raw.replace("suiprivkey", "")).slice(1, 33);
  }
  return fromHex(raw);
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

const rateLimitMap = new Map<string, number>();

function checkRateLimit(ip: string, userAddress: string): { ok: boolean; retryAfterMs?: number } {
  const key = `${ip}:${userAddress}`;
  const last = rateLimitMap.get(key);
  if (last) {
    const elapsed = Date.now() - last;
    const cooldown = 60_000; // 1 minute per action
    if (elapsed < cooldown) {
      return { ok: false, retryAfterMs: cooldown - elapsed };
    }
  }
  rateLimitMap.set(key, Date.now());
  return { ok: true };
}

export async function POST(req: NextRequest) {
  try {
    if (!SPONSOR_SECRET_KEY || SPONSOR_SECRET_KEY === "your_ed25519_private_key_hex") {
      return NextResponse.json(
        { error: "Sponsor not configured. Set SPONSOR_SECRET_KEY env var." },
        { status: 501 }
      );
    }

    const body: SponsorRequest = await req.json();
    const { action, userAddress } = body;

    if (!userAddress || typeof userAddress !== "string" || !userAddress.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid userAddress" }, { status: 400 });
    }

    const clientIp = getClientIp(req);
    const rateResult = checkRateLimit(clientIp, userAddress);
    if (!rateResult.ok) {
      return NextResponse.json(
        { error: "Rate limited", retryAfterMs: rateResult.retryAfterMs },
        { status: 429 }
      );
    }

    const keypair = Ed25519Keypair.fromSecretKey(parseSecretKey(SPONSOR_SECRET_KEY));
    const sponsorAddress = keypair.toSuiAddress();
    const client = new SuiJsonRpcClient({ url: RPC_URL, network: "testnet" });

    const tx = new Transaction();

    switch (action) {
      case "claim_usdc": {
        if (!FAUCET_ID) {
          return NextResponse.json(
            { error: "Faucet not configured. Set NEXT_PUBLIC_FAUCET_ID env var." },
            { status: 501 }
          );
        }
        tx.moveCall({
          target: `${FAUCET_PACKAGE_ID}::faucet::claim_test_usdc`,
          arguments: [
            tx.object(FAUCET_ID),
            tx.object("0x6"),
          ],
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Supported: claim_usdc` },
          { status: 400 }
        );
    }

    tx.setSender(userAddress);
    tx.setGasOwner(sponsorAddress);
    tx.setGasBudget(MAX_GAS_BUDGET);

    const txBytes = await tx.build({ client });
    const { bytes, signature } = await keypair.signTransaction(txBytes);

    const result = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: [signature],
      options: { showEffects: true },
    });

    if (result.effects?.status?.status !== "success") {
      return NextResponse.json(
        {
          error: `Transaction failed: ${result.effects?.status?.error || "Unknown error"}`,
          digest: result.digest,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      digest: result.digest,
      sponsor: sponsorAddress,
    });
  } catch (err) {
    console.error("Sponsor error:", err);
    const message = err instanceof Error ? err.message : "Sponsor error";
    if (message.includes("503") || message.includes("upgrade")) {
      return NextResponse.json({ error: "Sui RPC unavailable. Try again later." }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
