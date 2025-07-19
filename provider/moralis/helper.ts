import ky, { type KyInstance, HTTPError, TimeoutError } from "ky";
import type { GetSwapsByTokenAddressResponse } from "@/provider/interface.ts";

export interface MoralisApiClients {
  token: KyInstance;
}

export function createMoralisApiClient(apiToken: string): MoralisApiClients {
  try {
    const baseApi = ky.create({
      prefixUrl: "https://solana-gateway.moralis.io",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "accept": "application/json"
      },
      timeout: 30000,
      retry: {
        limit: 3,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
      }
    });
    
    return {
      token: baseApi.extend((options) => ({
        prefixUrl: `${options.prefixUrl}/token/mainnet`
      }))
    };
  } catch (error) {
    console.error("Failed to create Moralis API client:", error);
    throw new Error(`Moralis API client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validateTokenAddress(tokenAddress: string): void {
  if (!tokenAddress || typeof tokenAddress !== 'string' || tokenAddress.trim().length === 0) {
    throw new Error('Invalid token address: must be a non-empty string');
  }
}

export function validateMoralisResponse(response: unknown, tokenAddress: string): GetSwapsByTokenAddressResponse {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format from Moralis API');
  }

  const apiResponse = response as any;

  if (!apiResponse.result || !Array.isArray(apiResponse.result)) {
    console.warn(`No swap data found for token: ${tokenAddress}`);
    return {
      cursor: apiResponse.cursor || "",
      page: apiResponse.page || 1,
      pageSize: apiResponse.pageSize || 0,
      result: []
    };
  }

  console.log(`Successfully fetched ${apiResponse.result.length} swaps for token: ${tokenAddress}`);
  return apiResponse as GetSwapsByTokenAddressResponse;
}

export function handleMoralisError(error: unknown, context: string): Error {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    const statusText = error.response.statusText;
    
    switch (status) {
      case 400:
        return new Error(`Bad request to Moralis API: Invalid token address or parameters (${context})`);
      case 401:
        return new Error('Unauthorized: Invalid or expired Moralis API token');
      case 403:
        return new Error('Forbidden: Insufficient permissions for Moralis API');
      case 404:
        return new Error(`Token not found: ${context} - token does not exist or has no swap data`);
      case 429:
        return new Error('Rate limit exceeded: Too many requests to Moralis API. Please try again later.');
      case 500:
      case 502:
      case 503:
      case 504:
        return new Error(`Moralis API server error (${status}): ${statusText}. Please try again later.`);
      default:
        return new Error(`HTTP error ${status}: ${statusText}`);
    }
  }
  
  if (error instanceof TimeoutError) {
    return new Error('Request timeout: Moralis API took too long to respond. Please try again.');
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new Error('Network error: Unable to reach Moralis API. Please check your internet connection.');
  }
  
  if (error instanceof Error) {
    return new Error(`Moralis API error: ${error.message}`);
  }
  
  return new Error(`Unknown error occurred while ${context}`);
}