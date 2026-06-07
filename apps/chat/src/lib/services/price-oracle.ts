/**
 * CoinGecko Price Oracle Service
 * Fetches real-time token prices with in-memory caching to avoid rate limits on the Free tier.
 */

interface CacheEntry {
  prices: Record<string, number>;
  timestamp: number;
}

let priceCache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// Map token symbols to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  SUI: "sui",
  USDC: "usd-coin",
  USDT: "tether",
  WETH: "weth",
};

export async function fetchTokenPrices(): Promise<Record<string, number>> {
  const now = Date.now();

  // Return cached prices if valid
  if (priceCache && now - priceCache.timestamp < CACHE_TTL_MS) {
    return priceCache.prices;
  }

  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const apiKey = process.env.COINGECKO_API_KEY;

    // Build URL, appending API key if available (CoinGecko free tier uses x-cg-demo-api-key)
    const url = new URL("https://api.coingecko.com/api/v3/simple/price");
    url.searchParams.append("ids", ids);
    url.searchParams.append("vs_currencies", "usd");

    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Map CoinGecko IDs back to our symbols
    const prices: Record<string, number> = {};
    for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
      if (data[id] && data[id].usd) {
        prices[symbol] = data[id].usd;
      }
    }

    // Update cache
    priceCache = {
      prices,
      timestamp: now,
    };

    return prices;
  } catch (error) {
    console.error("Failed to fetch prices from CoinGecko:", error);
    
    // Fallback prices if API fails to prevent blocking the flow
    if (priceCache) {
      return priceCache.prices;
    }
    
    return {
      SUI: 2.075,
      USDC: 1.0,
      USDT: 1.0,
      WETH: 3200.0,
    };
  }
}

/**
 * Calculates the exchange rate between two tokens using their USD prices.
 * Returns how much tokenOut you get for 1 tokenIn.
 */
export function getExchangeRate(
  tokenIn: string,
  tokenOut: string,
  prices: Record<string, number>
): number {
  const priceIn = prices[tokenIn] || 1;
  const priceOut = prices[tokenOut] || 1;
  
  return priceIn / priceOut;
}
