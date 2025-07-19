export function getEnv(key: string): string{
  const env = Deno.env.get(key)
  if (env){
    return env
  }
  throw new Error(`ENV ${key} not found`)
}