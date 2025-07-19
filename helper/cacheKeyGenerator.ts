export function generateCacheKey(methodName: string, params: Record<string, unknown>): string {
  const paramString = stringifyParams(params);
  return `${methodName}:${paramString}`;
}

function stringifyParams(params: Record<string, unknown>): string {
  const flatParams = flattenObject(params);
  const sortedKeys = Object.keys(flatParams).sort();
  
  const paramPairs = sortedKeys
    .filter(key => flatParams[key] !== undefined && flatParams[key] !== null && flatParams[key] !== "")
    .map(key => {
      const value = String(flatParams[key]);
      const encodedValue = encodeURIComponent(value);
      return `${key}=${encodedValue}`;
    });
  
  return paramPairs.join('&');
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = value.join(',');
      } else {
        flattened[newKey] = value;
      }
    }
  }
  
  return flattened;
}