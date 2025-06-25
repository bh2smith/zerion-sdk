import { FungibleImplementation, TokenBalance, UserToken } from "./types";
import { parseUnits } from "viem";

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

export function scientificToDecimal(num: number): string {
  // If not in scientific notation, return as is
  if (!/^\d+\.?\d*e[+-]*\d+$/i.test(num.toString())) {
    return num.toString();
  }

  const parts = num.toString().toLowerCase().split("e");
  const mantissa = parts[0];
  const exponent = parseInt(parts[1], 10);

  // Remove decimal point from mantissa if exists
  const [whole = "", decimal = ""] = mantissa.split(".");
  const mantissaWithoutPoint = whole + decimal;

  if (exponent > 0) {
    const zerosToAdd = exponent - decimal.length;
    return mantissaWithoutPoint + "0".repeat(Math.max(0, zerosToAdd));
  } else {
    const absExponent = Math.abs(exponent);
    return `0.${"0".repeat(absExponent - 1)}${mantissaWithoutPoint}`;
  }
}

export function zerionToTokenBalance(userToken: UserToken): TokenBalance {
  const { meta, balances } = userToken;
  return {
    tokenAddress: meta.contractAddress || null,
    token: {
      name: meta.name,
      symbol: meta.symbol,
      decimals: meta.decimals,
      logoUri: meta.tokenIcon || "",
    },
    balance: parseUnits(
      scientificToDecimal(balances.balance),
      meta.decimals
    ).toString(),
    fiatBalance: balances.usdBalance.toFixed(2),
    fiatConversion: (balances.price || 0).toFixed(2),
  };
}

// Helper function to convert array of UserTokens to TokenBalances
export function zerionToTokenBalances(userTokens: UserToken[]): TokenBalance[] {
  return userTokens
    .filter((token) => !token.meta.isSpam) // Filter out spam tokens
    .map(zerionToTokenBalance);
}
