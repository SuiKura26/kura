import { Transaction } from "@mysten/sui/transactions";
import { deepbook, testnetCoins, testnetPools } from "@mysten/deepbook-v3";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

// Inisialisasi client Sui dengan DeepBook extension untuk Testnet
const client = new SuiJsonRpcClient({ url: "https://fullnode.testnet.sui.io:443", network: "testnet" }).$extend(deepbook({
  address: "0x0000000000000000000000000000000000000000000000000000000000000000" // Placeholder, address required by SDK
}));

/**
 * Mencari rute DeepBook menggunakan pool testnet bawaan dari SDK
 */
export async function findDeepBookRoute(
  tokenIn: string,
  tokenOut: string,
  coinType: string
) {
  // DeepBook testnet uses DBUSDC instead of USDC
  const tIn = tokenIn.toUpperCase() === "USDC" ? "DBUSDC" : tokenIn.toUpperCase();
  const tOut = tokenOut.toUpperCase() === "USDC" ? "DBUSDC" : tokenOut.toUpperCase();

  // Format naming di DeepBook SDK: "BASE_QUOTE" (contoh: "SUI_DBUSDC")
  let poolKeyStr = `${tIn}_${tOut}`;
  let pool = testnetPools[poolKeyStr];
  let isBaseToCoin = false;
  
  if (pool) {
    isBaseToCoin = true;
  } else {
    poolKeyStr = `${tOut}_${tIn}`;
    pool = testnetPools[poolKeyStr];
    isBaseToCoin = false;
  }

  if (!pool) {
    console.warn(`No DeepBook pool found for ${tokenIn}/${tokenOut}`);
    return null;
  }

  // VALIDASI KETAT: Periksa apakah tipe koin yang dimasukkan (input) benar-benar cocok dengan tipe koin di Pool
  const inputTypeString = isBaseToCoin 
    ? (testnetCoins as any)[pool.baseCoin]?.type 
    : (testnetCoins as any)[pool.quoteCoin]?.type;

  // Helper untuk membersihkan padding nol dari hex address Sui
  const normalizeType = (type: string | undefined) => {
    if (!type) return "";
    return type.replace(/^0x0+/, "0x");
  };

  if (normalizeType(inputTypeString) !== normalizeType(coinType)) {
    console.warn(`Type mismatch! User has ${coinType} but pool expects ${inputTypeString}`);
    return null; // Fallback ke Cetus Router
  }

  return {
    poolKey: poolKeyStr, // Mengembalikan string key, misal "SUI_DBUSDC", yang dibutuhkan oleh SDK
    isBaseToCoin,
    tokenInType: testnetCoins[tIn]?.type || tokenIn,
    tokenOutType: testnetCoins[tOut]?.type || tokenOut,
  };
}

/**
 * Membangun PTB Swap langsung menggunakan DeepBook V3 swapExactQuantity (tanpa BalanceManager)
 */
export function buildDeepBookSwapPTB(
  tx: Transaction,
  routeData: any,
  coinToSwap: any,
  amountInBaseUnits: bigint,
  senderAddress: string,
  deepAmountBaseUnits: bigint = BigInt(0) // Di testnet seringkali fee bisa 0 atau kita perlu split DEEP
) {
  if (!coinToSwap) return;

  try {
    // Buat koin dengan saldo 0 untuk DEEP token (fee)
    const deepType = testnetCoins["DEEP"]?.type || "0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP";
    const zeroDeepCoin = tx.moveCall({
      target: "0x2::coin::zero",
      typeArguments: [deepType]
    });

    // Parameter untuk swapExactQuantity direct swap
    const params: any = {
      poolKey: routeData.poolKey,
      amount: amountInBaseUnits,
      deepAmount: deepAmountBaseUnits, // Jumlah DEEP untuk membayar fee
      minOut: BigInt(0), // Minimal output (0 = tidak ada slippage protection untuk testnet simulation)
      isBaseToCoin: routeData.isBaseToCoin,
      // Pass zero DEEP coin instead of tx.gas to avoid CommandArgumentError (Type mismatch)
      deepCoin: zeroDeepCoin 
    };

    if (routeData.isBaseToCoin) {
      params.baseCoin = coinToSwap;
    } else {
      params.quoteCoin = coinToSwap;
    }

    // DeepBook client menghasilkan builder function yang dipanggil dengan tx
    const returnedCoins = client.deepbook.deepBook.swapExactQuantity(params)(tx);
    
    // Hasil output swap adalah array berisi 3 koin (baseCoinResult, quoteCoinResult, deepCoinResult)
    // Transfer ketiganya ke senderAddress agar tidak terjadi UnusedValueWithoutDrop
    tx.transferObjects([...returnedCoins], tx.pure.address(senderAddress));

  } catch (error) {
    console.warn("DeepBook Swap PTB build failed:", error);
    // FALLBACK SAFETY: kembalikan token ke user jika build PTB DeepBook gagal
    // Hal ini mungkin karena format SDK ada perbedaan
    throw error;
  }
}
