import { FungibleImplementation } from "./types";

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

export function polygonNativeAssetImplementation(): FungibleImplementation[] {
  // Skip Recognition of MRC20 Token Contract:
  // https://polygonscan.com/address/0x0000000000000000000000000000000000001010
  // This token has a payable transfer function and messes shit up.
  return [
    {
      chain_id: "polygon",
      address: null,
      decimals: 18,
    },
  ];
}
