// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildQueryString(params: Record<string, any>): string {
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue; // Skip undefined or null values

    if (Array.isArray(value)) {
      query[key] = value.join(","); // Join arrays with commas
    } else {
      query[key] = value.toString();
    }
  }

  return new URLSearchParams(query).toString();
}
