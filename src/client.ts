import { iZerionAPI } from "./interface";
import {
  ChainData,
  FungiblePositionsResponse,
  GetChainsResponse,
  GetPortfolioResponse,
  PortfolioData,
  PositionData,
} from "./types";

const BASE_URL = "https://api.zerion.io/v1";

// Utility function to make API requests with error handling
async function fetchFromZerion<T>(
  endpoint: string,
  apiKey: string,
  env?: string
): Promise<T> {
  const headers = {
    accept: "application/json",
    authorization: `Basic ${apiKey}`,
    // Optionally add the "X-Env" header for testnet or other environments
    ...(env ? { "X-Env": env } : {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  const data = await response.json();
  return data as T;
}

export class ZerionAPI implements iZerionAPI {
  private apiKey: string;
  env: string | undefined;

  constructor(apiKey: string, testnet: boolean) {
    this.apiKey = apiKey;
    this.env = testnet ? "testnet" : undefined;
  }

  async getChains(): Promise<ChainData[]> {
    const { data } = await fetchFromZerion<GetChainsResponse>(
      "/chains/",
      this.apiKey,
      this.env
    );
    return data;
  }

  async getPortfolio(
    walletAddress: string,
    currency: string = "usd"
  ): Promise<PortfolioData> {
    const { data } = await fetchFromZerion<GetPortfolioResponse>(
      `/wallets/${walletAddress}/portfolio?currency=${currency}`,
      this.apiKey,
      this.env
    );
    return data;
  }

  async getFungiblePositions(
    walletAddress: string,
    currency: string = "usd",
    filterPositions: string = "only_simple",
    filterTrash: string = "only_non_trash",
    sort: string = "value"
  ): Promise<PositionData[]> {
    const { data } = await fetchFromZerion<FungiblePositionsResponse>(
      `/wallets/${walletAddress}/positions/?filter[positions]=${filterPositions}&currency=${currency}&filter[trash]=${filterTrash}&sort=${sort}`,
      this.apiKey,
      this.env
    );
    return data;
  }
}
