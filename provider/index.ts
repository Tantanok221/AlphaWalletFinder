import { CONFIG } from "../config.ts";
import { initMoralisProvider } from "./moralis/index.ts";
import { CachedTokenDataProvider } from "./cached/cachedTokenDataProvider.ts";
import { getRedisClient } from "../helper/redis.ts";
import type { TokenDataProvider } from "./interface.ts";
export type * from "./interface.ts";

export async function getDefaultTokenDataProvider(): Promise<TokenDataProvider> {
  const baseProvider = getBaseProvider();
  
  if (!CONFIG.cache.enabled) {
    return baseProvider;
  }

  try {
    const redisClient = await getRedisClient();
    return new CachedTokenDataProvider(
      baseProvider,
      redisClient,
      CONFIG.cache.defaultTtlSeconds
    );
  } catch (error) {
    console.warn("Failed to initialize Redis cache, falling back to base provider:", error);
    return baseProvider;
  }
}

function getBaseProvider(): TokenDataProvider {
  switch (CONFIG.defaultTokenProvider) {
    case "moralis":
      return initMoralisProvider();
    default:
      return initMoralisProvider();
  }
}