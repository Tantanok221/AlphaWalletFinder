interface AppConfig {
  defaultTokenProvider: "moralis" | "helius" | "other";
  cache: {
    enabled: boolean;
    defaultTtlSeconds: number;
  };
}

export const CONFIG: AppConfig = {
  defaultTokenProvider: "moralis",
  cache: {
    enabled: false,
    defaultTtlSeconds: 300,
  },
};
