import {CONFIG} from "../config.ts";
import { initMoralisProvider } from "./moralis/index.ts";
export type * from "./interface.ts";

export function getDefaultTokenDataProvider(){
  switch (CONFIG.defaultTokenProvider) {
  case "moralis":
    return initMoralisProvider();
  default:
    return initMoralisProvider();
  }
}