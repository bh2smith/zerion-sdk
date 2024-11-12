import { ZERION_CONFIG } from "../config";
import chainData from "../../data/chains.json";
import { ChainData } from "../types";

// A lot of ceremony, but better than dumping that whole file here.
export const CHAINS: ChainData[] = chainData as unknown as ChainData[];

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
