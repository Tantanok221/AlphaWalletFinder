import type { RedisClientType } from "npm:redis";
import type {
  GetSwapsByTokenAddressParams,
  GetSwapsByTokenAddressResponse,
  TokenDataProvider,
} from "@/provider/interface.ts";
import { generateCacheKey } from "./helper.ts";

interface CacheOptions<TParams, TResponse> {
  methodName: string;
  params: TParams;
  operation: () => Promise<TResponse>;
  cachePermanently?: boolean;
}

export class CachedTokenDataProvider implements TokenDataProvider {
  constructor(
    private readonly underlyingProvider: TokenDataProvider,
    private readonly redisClient: RedisClientType,
    private readonly defaultTtlSeconds: number = 300,
  ) {}

  async getSwapsByTokenAddress(
    params: GetSwapsByTokenAddressParams,
  ): Promise<GetSwapsByTokenAddressResponse> {
    return this.executeWithCache({
      methodName: "getSwapsByTokenAddress",
      params,
      operation: () => this.underlyingProvider.getSwapsByTokenAddress(params),
      cachePermanently: true,
    });
  }

  private async executeWithCache<TParams, TResponse>(
    options: CacheOptions<TParams, TResponse>,
  ): Promise<TResponse> {
    const { methodName, params, operation, cachePermanently = false } = options;
    const cacheKey = generateCacheKey(
      methodName,
      params as Record<string, unknown>,
    );

    try {
      const cachedResult = await this.redisClient.get(cacheKey);
      if (cachedResult) {
        console.log(`Cache hit on ${methodName}`);
        return JSON.parse(cachedResult) as TResponse;
      }
    } catch (error) {
      console.warn(`Cache read error for key ${cacheKey}:`, error);
    }

    const result = await operation();

    try {
      const ttl = cachePermanently ? undefined : this.defaultTtlSeconds;
      const serializedResult = JSON.stringify(result);

      if (ttl !== undefined) {
        await this.redisClient.setEx(cacheKey, ttl, serializedResult);
        console.log(`Cached ${methodName} with TTL ${ttl}s`);
      } else {
        await this.redisClient.set(cacheKey, serializedResult);
        console.log(`Cached ${methodName} permanently`);
      }
    } catch (error) {
      console.warn(`Cache write error for key ${cacheKey}:`, error);
    }

    return result;
  }
}
