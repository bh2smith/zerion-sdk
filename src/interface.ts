import { ChainData, PortfolioData, PositionData } from "./types";

// Interface for the Zerion API
export interface iZerionAPI {
  /**
   * Fetches all supported blockchain chains from Zerion.
   * @param apiKey The Zerion API key for authorization (base64 format).
   * @param env Optional environment value for testing or production (e.g., 'testnet').
   * @returns A promise resolving to an array of chains supported by Zerion.
   */
  getChains(apiKey: string, env?: string): Promise<ChainData[]>;

  /**
   * Fetches the portfolio of a specific wallet, partitioned by network.
   * @param walletAddress The wallet address whose portfolio will be fetched.
   * @param apiKey The Zerion API key for authorization.
   * @param currency Optional currency code to get portfolio values (e.g., 'usd').
   * @returns A promise resolving to the portfolio data for the wallet.
   */
  getPortfolio(
    walletAddress: string,
    apiKey: string,
    currency?: string
  ): Promise<PortfolioData>;

  /**
   * Fetches the fungible token positions of a specific wallet.
   * @param walletAddress The wallet address whose fungible positions will be fetched.
   * @param apiKey The Zerion API key for authorization.
   * @param currency Optional currency code to get token values (e.g., 'usd').
   * @param env Optional environment value for testing or production (e.g., 'testnet').
   * @param filterPositions Optional filter to include only simple or specific positions.
   * @param filterTrash Optional filter to exclude positions marked as trash.
   * @param sort Optional sorting parameter (e.g., 'value').
   * @returns A promise resolving to the wallet's fungible token positions.
   */
  getFungiblePositions(
    walletAddress: string,
    apiKey: string,
    currency?: string,
    env?: string,
    filterPositions?: string,
    filterTrash?: string,
    sort?: string
  ): Promise<PositionData[]>;
}
