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

export class ZerionAPI {
  private apiKey: string;
  env: string | undefined;

  constructor(apiKey: string, testnet: boolean) {
    this.apiKey = apiKey;
    this.env = testnet ? "testnet" : undefined;
  }

  /**
   * Fetches all supported blockchain chains from Zerion.
   * @returns A promise resolving to an array of chains supported by Zerion.
   */
  async getChains(): Promise<ChainData[]> {
    const { data } = await fetchFromZerion<GetChainsResponse>(
      "/chains/",
      this.apiKey,
      this.env
    );
    return data;
  }

  /**
   * Fetches the portfolio of a specific wallet, partitioned by network.
   * @param walletAddress The wallet address whose portfolio will be fetched.
   * @param apiKey The Zerion API key for authorization.
   * @param currency Optional currency code to get portfolio values (e.g., 'usd').
   * @returns A promise resolving to the portfolio data for the wallet.
   */
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

  /**
   * Fetches the fungible token positions of a specific wallet.
   * @param walletAddress The wallet address whose fungible positions will be fetched.
   * @param currency Optional currency code to get token values (e.g., 'usd').
   * @param filterPositions Optional filter to include only simple or specific positions.
   * @param filterTrash Optional filter to exclude positions marked as trash.
   * @param sort Optional sorting parameter (e.g., 'value').
   * @returns A promise resolving to the wallet's fungible token positions.
   */
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
