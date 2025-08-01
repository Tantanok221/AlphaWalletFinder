import { getTokenHolderWithinDateRange } from "./use_case/getTokenHolderWithinDateRange.ts";
import { closeRedis } from "./helper/redis.ts";

try {
  await getTokenHolderWithinDateRange({
    tokenAddress: "4ZVCJdxrbWLWKFFAZqqphyNBUhPE7YpnHWXvFuKkbonk",
    endDate: new Date("2025-07-19T07:00:00.000Z"),
  });
} finally {
  await closeRedis();
}
