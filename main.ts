import {getTokenHolderBeforeDateTime} from "./use_case/getTokenHolderBeforeDateTime.ts";

await getTokenHolderBeforeDateTime({
  tokenAddress: "4ZVCJdxrbWLWKFFAZqqphyNBUhPE7YpnHWXvFuKkbonk",
  endDate: new Date("2025-07-19T07:00:00.000Z"),
})
