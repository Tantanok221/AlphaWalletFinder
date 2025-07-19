import { assertEquals, assertThrows } from "@std/assert";
import { 
  createMoralisApiClient,
  validateTokenAddress,
  validateMoralisResponse,
} from "@/provider/moralis/helper.ts";

Deno.test("createMoralisApiClient - creates valid client structure", () => {
  const apiToken = "test-token";
  const clients = createMoralisApiClient(apiToken);
  
  assertEquals(typeof clients, "object");
  assertEquals(typeof clients.token, "function");
  assertEquals("token" in clients, true);
});

Deno.test("createMoralisApiClient - throws on empty token", () => {
  assertThrows(
    () => createMoralisApiClient(""),
    Error,
    "Invalid API token: must be a non-empty string"
  );
});

Deno.test("validateTokenAddress - accepts valid address", () => {
  validateTokenAddress("So11111111111111111111111111111111111111112");
  validateTokenAddress("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
});

Deno.test("validateTokenAddress - rejects empty string", () => {
  assertThrows(
    () => validateTokenAddress(""),
    Error,
    "Invalid token address: must be a non-empty string"
  );
});

Deno.test("validateTokenAddress - rejects whitespace-only string", () => {
  assertThrows(
    () => validateTokenAddress("   "),
    Error,
    "Invalid token address: must be a non-empty string"
  );
});

Deno.test("validateTokenAddress - rejects null/undefined", () => {
  assertThrows(
    () => validateTokenAddress(null as any),
    Error,
    "Invalid token address: must be a non-empty string"
  );
  
  assertThrows(
    () => validateTokenAddress(undefined as any),
    Error,
    "Invalid token address: must be a non-empty string"
  );
});

Deno.test("validateMoralisResponse - handles valid response with data", () => {
  const mockResponse = {
    cursor: "next-page-cursor",
    page: 1,
    pageSize: 100,
    result: [
      { id: "swap1", amount: "1000" },
      { id: "swap2", amount: "2000" }
    ]
  };
  
  const result = validateMoralisResponse(mockResponse, "test-token");
  assertEquals(result.cursor, "next-page-cursor");
  assertEquals(result.page, 1);
  assertEquals(result.pageSize, 100);
  assertEquals(result.result.length, 2);
});

Deno.test("validateMoralisResponse - handles empty result array", () => {
  const mockResponse = {
    cursor: "",
    page: 1,
    pageSize: 0,
    result: []
  };
  
  const result = validateMoralisResponse(mockResponse, "test-token");
  assertEquals(result.result.length, 0);
  assertEquals(result.cursor, "");
});

Deno.test("validateMoralisResponse - handles response with missing result", () => {
  const mockResponse = {
    cursor: "some-cursor",
    page: 1,
    pageSize: 0
  };
  
  const result = validateMoralisResponse(mockResponse, "test-token");
  assertEquals(result.result.length, 0);
  assertEquals(result.cursor, "some-cursor");
});

Deno.test("validateMoralisResponse - throws on invalid response", () => {
  assertThrows(
    () => validateMoralisResponse(null, "test-token"),
    Error,
    "Invalid response format from Moralis API"
  );
  
  assertThrows(
    () => validateMoralisResponse("invalid", "test-token"),
    Error,
    "Invalid response format from Moralis API"
  );
});