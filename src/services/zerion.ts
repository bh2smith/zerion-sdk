import { ZERION_CONFIG } from "../config";
import mainnetChainData from "../../data/mainnet-chains.json";
import mainnetNativeTokens from "../../data/mainnet-native-tokens.json";
import testnetChainData from "../../data/testnet-chains.json";
import testnetNativeTokens from "../../data/testnet-native-tokens.json";
import { ChainData, FungibleTokenData } from "../types";

// A lot of ceremony, but better than dumping that whole file here.
export const STATIC_CHAINS_MAINNET: ChainData[] =
  mainnetChainData as unknown as ChainData[];
export const STATIC_NATIVE_TOKENS_MAINNET: Record<string, FungibleTokenData> =
  mainnetNativeTokens as unknown as Record<string, FungibleTokenData>;
export const STATIC_CHAINS_TESTNET: ChainData[] =
  testnetChainData as unknown as ChainData[];
export const STATIC_NATIVE_TOKENS_TESTNET: Record<string, FungibleTokenData> =
  testnetNativeTokens as unknown as Record<string, FungibleTokenData>;

export class ZerionService {
  private readonly apiKey: string;
  private readonly env: string | undefined;
  constructor(apiKey: string, testnet: boolean) {
    this.apiKey = apiKey.startsWith("zk_")
      ? Buffer.from(`${apiKey}:`).toString("base64")
      : apiKey;
    this.env = testnet ? "testnet" : undefined;
  }

  // Utility function to make API requests with error handling
  async fetchFromZerion<T>(endpoint: string): Promise<T> {
    const headers = {
      accept: "application/json",
      authorization: `Basic ${this.apiKey}`,
      // Optionally add the "X-Env" header for testnet or other environments
      ...(this.env ? { "X-Env": this.env } : {}),
    };
    const url = `${ZERION_CONFIG.BASE_URL}${endpoint}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  }
}
