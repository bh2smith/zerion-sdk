export function isBase64(str: string): boolean {
  if (!str) return false; // Handle empty string case

  try {
    const base64Regex =
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    if (!base64Regex.test(str)) return false;

    const decoded = Buffer.from(str, "base64").toString("base64");
    return decoded === str;
  } catch {
    return false;
  }
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}
