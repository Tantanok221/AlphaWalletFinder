// Get Token Holders within Date Range
// Filters token holders based on date criteria:
// - If only startDate: returns holders after this date
// - If only endDate: returns holders before this date
// - If both: returns holders within the date range
import {
  getDefaultTokenDataProvider,
  TokenDataProvider,
} from "@/provider/index.ts";

interface GetTokenHolderDateRangeParams {
  tokenAddress: string;
  startDate?: Date; // Optional: holders after this date (inclusive)
  endDate?: Date; // Optional: holders before this date (inclusive)
  tokenDataProvider?: TokenDataProvider;
}

export async function getTokenHolderWithinDateRange({
  tokenAddress,
  startDate,
  endDate,
  tokenDataProvider,
}: GetTokenHolderDateRangeParams) {
  const provider = tokenDataProvider ?? await getDefaultTokenDataProvider();
  // Validation getTokenHolderWithDateTime: at least one date must be provided
  if (!startDate && !endDate) {
    throw new Error("At least one of startDate or endDate must be provided");
  }
  const data = await provider.getSwapsByTokenAddress({
    tokenAddress,
    fromDate: startDate ? Math.floor(startDate.getTime() / 1000) : undefined,
    toDate: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
  });
  console.log(data);
}
