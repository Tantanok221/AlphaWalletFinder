export interface getSwapsByTokenAddressParams {
  tokenAddress: string;
  toDate?: string;
  transactionsTypes?: "buy" | "sell";
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

export interface GetSwapsByTokenAddressResponse {
  cursor: string;
  page: number;
  pageSize: number;
  result: SwapTransaction[];
}