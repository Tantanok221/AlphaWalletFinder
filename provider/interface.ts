// Base provider interface for dependency injection
export interface TokenDataProvider {
  // Get token swaps/transactions by address with optional date filtering
  getSwapsByTokenAddress(params: GetSwapsByTokenAddressParams): Promise<GetSwapsByTokenAddressResponse>;
}

// Parameters for getting swaps by token address
export interface GetSwapsByTokenAddressParams {
  tokenAddress: string;
  toDate?: string | number;
  fromDate?: string | number;
  transactionTypes?: "buy" | "sell";
  [key: string]: unknown;
}

// Response interface for swap queries
export interface GetSwapsByTokenAddressResponse {
  cursor: string;
  page: number;
  pageSize: number;
  result: SwapTransaction[];
}

// Common types used across providers
export interface SwapTransaction {
  transactionHash: string;
  transactionIndex: number;
  transactionType: "buy" | "sell";
  baseQuotePrice: string;
  blockTimestamp: string;
  blockNumber: number;
  subCategory: string;
  walletAddress: string;
  pairAddress: string;
  pairLabel: string;
  exchangeName: string;
  exchangeAddress: string;
  exchangeLogo: string;
  baseToken: string;
  quoteToken: string;
  bought: TokenInfo;
  sold: TokenInfo;
  totalValueUsd: number;
}

export interface TokenInfo {
  address: string;
  amount: string;
  usdPrice: number;
  usdAmount: number;
  symbol: string;
  logo: string;
  name: string;
  tokenType: "token0" | "token1";
}

export interface TokenHolder {
  walletAddress: string;
  amount: string;
  lastTransactionDate: Date;
}

// Provider factory type for service initialization
export type ProviderFactory<T extends TokenDataProvider> = () => T;