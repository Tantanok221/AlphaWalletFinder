import { assertEquals, assertThrows } from "@std/assert";
import { getEnv } from "@/helper/env.ts";

Deno.test("getEnv - returns environment variable when it exists", () => {
  const testKey = "TEST_ENV_VAR";
  const testValue = "test-value-123";

  Deno.env.set(testKey, testValue);

  const result = getEnv(testKey);
  assertEquals(result, testValue);

  Deno.env.delete(testKey);
});

Deno.test("getEnv - throws error when environment variable does not exist", () => {
  const nonExistentKey = "NON_EXISTENT_ENV_VAR";

  Deno.env.delete(nonExistentKey);

  assertThrows(
    () => getEnv(nonExistentKey),
    Error,
    `ENV ${nonExistentKey} not found`,
  );
});

Deno.test("getEnv - throws error for empty string environment variable", () => {
  const testKey = "EMPTY_ENV_VAR";

  Deno.env.set(testKey, "");

  assertThrows(
    () => getEnv(testKey),
    Error,
    `ENV ${testKey} not found`,
  );

  Deno.env.delete(testKey);
});

Deno.test("getEnv - handles environment variable with spaces", () => {
  const testKey = "SPACE_ENV_VAR";
  const testValue = "value with spaces";

  Deno.env.set(testKey, testValue);

  const result = getEnv(testKey);
  assertEquals(result, testValue);

  Deno.env.delete(testKey);
});

Deno.test("getEnv - handles special characters in environment variable", () => {
  const testKey = "SPECIAL_ENV_VAR";
  const testValue = "value!@#$%^&*()_+-={}[]|;:,.<>?";

  Deno.env.set(testKey, testValue);

  const result = getEnv(testKey);
  assertEquals(result, testValue);

  Deno.env.delete(testKey);
});
