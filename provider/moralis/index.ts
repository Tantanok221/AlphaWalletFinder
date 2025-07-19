import { getEnv } from "@/helper/env.ts";
import type { TokenDataProvider, GetSwapsByTokenAddressParams, GetSwapsByTokenAddressResponse } from "@/provider/interface.ts";
import { createMoralisApiClient, validateTokenAddress, validateMoralisResponse, handleMoralisError, type MoralisApiClients } from "./helper.ts";

class MoralisProvider implements TokenDataProvider {
  private apiClients: MoralisApiClients;
  
  constructor() {
    const apiToken = getEnv("MORALIS_API_TOKEN");
    this.apiClients = createMoralisApiClient(apiToken);
  }

  private buildSearchParams(params: Record<string, string| number |undefined>, defaults: Record<string, string|number> = {}): Record<string, string | number> {
    return Object.entries({ ...defaults, ...params })
      .filter(([_, value]) => value !== undefined && value !== null && value !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  async getSwapsByTokenAddress({tokenAddress, toDate, fromDate, transactionTypes}: GetSwapsByTokenAddressParams): Promise<GetSwapsByTokenAddressResponse> {
    try {
      validateTokenAddress(tokenAddress);

      const searchParams = this.buildSearchParams(
        { fromDate, toDate, transactionTypes },
        { limit: 10 }
      );
      
      console.log(`Fetching swaps for token: ${tokenAddress}`);
      
      const response = await this.apiClients.token.get(`${tokenAddress}/swaps`, {
        searchParams
      }).json();

      return validateMoralisResponse(response, tokenAddress);

    } catch (error) {
      throw handleMoralisError(error, `fetching swaps for token: ${tokenAddress}`);
    }
  }
}

export function initMoralisProvider(): TokenDataProvider {
  return new MoralisProvider();
}