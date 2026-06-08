export interface CoinInfo {
  coinType: string;
  decimals: number;
  totalBalanceBase: bigint;
  symbol: string;
}

export async function findCoinInWallet(
  client: any,
  ownerAddress: string,
  requestedSymbol: string,
): Promise<CoinInfo | null> {
  const symbolUpper = requestedSymbol.toUpperCase();

  // 1. Fetch all balances for the user
  const balances = await client.getAllBalances({ owner: ownerAddress });

  if (!balances || balances.length === 0) {
    return null;
  }

  // Optimize: Hardcode known native SUI to avoid unnecessary metadata fetch
  if (symbolUpper === "SUI") {
    const suiBalance = balances.find(
      (b: any) => b.coinType === "0x2::sui::SUI",
    );
    if (suiBalance) {
      return {
        coinType: "0x2::sui::SUI",
        decimals: 9,
        totalBalanceBase: BigInt(suiBalance.totalBalance),
        symbol: "SUI",
      };
    }
  }

  // 2. Fetch metadata for all coin types in the user's wallet
  const metadataPromises = balances.map(async (balance: any) => {
    try {
      const metadata = await client.getCoinMetadata({
        coinType: balance.coinType,
      });
      return { balance, metadata };
    } catch (e) {
      console.warn(`Failed to fetch metadata for ${balance.coinType}`, e);
      return { balance, metadata: null };
    }
  });

  const results = await Promise.all(metadataPromises);

  // 3. Match requested symbol
  for (const result of results) {
    if (
      result.metadata &&
      result.metadata.symbol.toUpperCase() === symbolUpper
    ) {
      return {
        coinType: result.balance.coinType,
        decimals: result.metadata.decimals,
        totalBalanceBase: BigInt(result.balance.totalBalance),
        symbol: result.metadata.symbol.toUpperCase(),
      };
    }
  }

  return null;
}

export async function getAllWalletBalances(
  client: any,
  ownerAddress: string,
): Promise<CoinInfo[]> {
  const balances = await client.getAllBalances({ owner: ownerAddress });

  if (!balances || balances.length === 0) {
    return [];
  }

  const metadataPromises = balances.map(async (balance: any) => {
    // Treat SUI differently since it's native and we know its decimals
    if (balance.coinType === "0x2::sui::SUI") {
      return {
        coinType: "0x2::sui::SUI",
        decimals: 9,
        totalBalanceBase: BigInt(balance.totalBalance),
        symbol: "SUI",
      };
    }

    try {
      const metadata = await client.getCoinMetadata({
        coinType: balance.coinType,
      });
      if (metadata) {
        return {
          coinType: balance.coinType,
          decimals: metadata.decimals,
          totalBalanceBase: BigInt(balance.totalBalance),
          symbol: metadata.symbol.toUpperCase(),
        };
      }
    } catch (e) {
      console.warn(`Failed to fetch metadata for ${balance.coinType}`, e);
    }
    return null;
  });

  const results = await Promise.all(metadataPromises);

  // Filter out nulls and zero balances
  return results.filter(
    (r): r is CoinInfo => r !== null && r.totalBalanceBase > BigInt(0),
  );
}
