interface AppConfig {
  defaultTokenProvider: "moralis" | "helius" | "other";
}

export const CONFIG: AppConfig = {
  defaultTokenProvider: "moralis"
};