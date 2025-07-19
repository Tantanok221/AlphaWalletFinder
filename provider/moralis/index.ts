import ky, { type KyInstance } from "ky";
import { getEnv } from "@/helper/env.ts";
import type { TokenDataProvider, GetSwapsByTokenAddressParams, GetSwapsByTokenAddressResponse } from "@/provider/interface.ts";

class MoralisProvider implements TokenDataProvider {
  private tokenApi: KyInstance;
  
  constructor() {
    const baseApi = ky.create({
      prefixUrl: "https://solana-gateway.moralis.io",
      headers: {
        "Authorization": `Bearer ${getEnv("MORALIS_API_TOKEN")}`,
        "accept": "application/json"
      }
    });
    this.tokenApi = baseApi.extend((options) => ({prefixUrl: `${options.prefixUrl}/token/mainnet`}));
  }

  private buildSearchParams(params: Record<string, string| number |undefined>, defaults: Record<string, string|number> = {}): Record<string, string | number> {
    return Object.entries({ ...defaults, ...params })
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  async getSwapsByTokenAddress({tokenAddress,toDate,fromDate,transactionTypes}: GetSwapsByTokenAddressParams): Promise<GetSwapsByTokenAddressResponse> {
    const searchParams = this.buildSearchParams(
      { fromDate, toDate, transactionTypes },
      { limit: 10 }
    );
    
    return await this.tokenApi.get(`${tokenAddress}/swaps`, {
      searchParams
    }).json<GetSwapsByTokenAddressResponse>()
  }
}

export function initMoralisProvider(): TokenDataProvider {
  return new MoralisProvider();
}