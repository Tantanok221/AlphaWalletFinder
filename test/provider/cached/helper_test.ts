import { assertEquals } from "@std/assert";
import { generateCacheKey } from "@/provider/cached/helper.ts";

Deno.test("generateCacheKey - simple params", () => {
  const result = generateCacheKey("getSwaps", { address: "abc123", limit: 10 });
  assertEquals(result, "getSwaps:address=abc123&limit=10");
});

Deno.test("generateCacheKey - with date params", () => {
  const result = generateCacheKey("getSwaps", { 
    address: "abc123", 
    fromDate: "2024-01-01",
    toDate: "2024-01-31"
  });
  assertEquals(result, "getSwaps:address=abc123&fromDate=2024-01-01&toDate=2024-01-31");
});

Deno.test("generateCacheKey - nested object params", () => {
  const result = generateCacheKey("getSwaps", { 
    address: "abc123",
    options: { limit: 100, offset: 0 }
  });
  assertEquals(result, "getSwaps:address=abc123&options.limit=100&options.offset=0");
});

Deno.test("generateCacheKey - array params", () => {
  const result = generateCacheKey("getMultipleSwaps", { 
    addresses: ["addr1", "addr2", "addr3"],
    limit: 50
  });
  assertEquals(result, "getMultipleSwaps:addresses=addr1%2Caddr2%2Caddr3&limit=50");
});

Deno.test("generateCacheKey - filters out null/undefined/empty values", () => {
  const result = generateCacheKey("getSwaps", { 
    address: "abc123",
    limit: 10,
    nullValue: null,
    undefinedValue: undefined,
    emptyString: ""
  });
  assertEquals(result, "getSwaps:address=abc123&limit=10");
});

Deno.test("generateCacheKey - encodes special characters", () => {
  const result = generateCacheKey("getSwaps", { 
    address: "abc@123#special",
    query: "token&address"
  });
  assertEquals(result, "getSwaps:address=abc%40123%23special&query=token%26address");
});

Deno.test("generateCacheKey - sorts keys consistently", () => {
  const result1 = generateCacheKey("getSwaps", { b: "2", a: "1", c: "3" });
  const result2 = generateCacheKey("getSwaps", { c: "3", a: "1", b: "2" });
  assertEquals(result1, result2);
  assertEquals(result1, "getSwaps:a=1&b=2&c=3");
});

Deno.test("generateCacheKey - handles complex nested structure", () => {
  const result = generateCacheKey("getSwaps", { 
    address: "abc123",
    filters: {
      dateRange: { from: "2024-01-01", to: "2024-01-31" },
      tokens: ["SOL", "USDC"],
      minAmount: 100
    }
  });
  assertEquals(result, "getSwaps:address=abc123&filters.dateRange.from=2024-01-01&filters.dateRange.to=2024-01-31&filters.minAmount=100&filters.tokens=SOL%2CUSDC");
});

Deno.test("generateCacheKey - empty params object", () => {
  const result = generateCacheKey("getSwaps", {});
  assertEquals(result, "getSwaps:");
});