import {initMoralis} from "./provider/index.ts";

const moralisProvider = initMoralis()

const data = await moralisProvider.getSwapsByTokenAddress({
  tokenAddress: "4ZVCJdxrbWLWKFFAZqqphyNBUhPE7YpnHWXvFuKkbonk",
  toDate: "2025-07-19T07:00:00.000Z" ,
  transactionsTypes: "buy",
}
)
console.log(data)
