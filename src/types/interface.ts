import {
  ChainData,
  PortfolioData,
  PositionData,
  UserDashboardResponse,
} from ".";

// Interface for the Zerion API
export interface iZerionAPI {
  // Add UI property
  readonly ui: iZerionUI;

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

export interface iZerionUI {
  /**
   * Fetches and transforms a wallet's balances into a dashboard-friendly format.
   * Includes chain information, token balances, and USD values.
   * @param walletAddress The wallet address to fetch balances for
   * @returns A promise resolving to the formatted dashboard response
   */
  getUserBalances(walletAddress: string): Promise<UserDashboardResponse>;
}
