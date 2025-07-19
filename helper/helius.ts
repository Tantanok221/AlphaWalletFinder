import { Helius } from "npm:helius-sdk";
import {getEnv} from "./env.ts";

class HeliusProvider {
  helius: Helius;
  constructor() {
    this.helius = new Helius(getEnv("HELIUS_API_TOKEN"));
  }
}


export function initHelius() {
  return new HeliusProvider();
}
