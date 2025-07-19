import ky, { type KyInstance } from "ky";
import { getEnv } from "@/helper/env.ts";
import type { getSwapsByTokenAddressParams, GetSwapsByTokenAddressResponse } from "./types.ts";

class MoralisProvider {
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

  private buildSearchParams(params: Record<string, any>, defaults: Record<string, any> = {}): Record<string, string | number> {
    return Object.entries({ ...defaults, ...params })
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  async getSwapsByTokenAddress({tokenAddress,toDate,transactionsTypes}:getSwapsByTokenAddressParams): Promise<GetSwapsByTokenAddressResponse> {
    const searchParams = this.buildSearchParams(
      { toDate, transactionTypes: transactionsTypes },
      { limit: 10 }
    );
    
    return await this.tokenApi.get(`${tokenAddress}/swaps`, {
      searchParams
    }).json<GetSwapsByTokenAddressResponse>()
  }
}

export function initMoralis(): MoralisProvider {
  return new MoralisProvider();
}