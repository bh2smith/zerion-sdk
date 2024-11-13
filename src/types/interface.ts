import {
  ChainData,
  PortfolioData,
  PositionData,
  UserBalanceOptions,
  UserDashboardResponse,
  FungibleOptions,
  NFTPosition,
  FungibleTokenData,
} from ".";

// Interface for the Zerion API
export interface iZerionAPI {
  // Add UI property
  readonly ui: iZerionUI;

  /**
   * Fetches all supported blockchain chains from Zerion.
   * @returns A promise resolving to an array of chains supported by Zerion.
   */
  getChains(): Promise<ChainData[]>;

  /**
   * Fetches the portfolio of a specific wallet, partitioned by network.
   * @param walletAddress The wallet address whose portfolio will be fetched.
   * @param currency Optional currency code to get portfolio values (e.g., 'usd').
   * @returns A promise resolving to the portfolio data for the wallet.
   */
  getPortfolio(
    walletAddress: string,
    currency?: string
  ): Promise<PortfolioData>;

  /**
   * Fetches the fungible token positions of a specific wallet.
   * @param walletAddress The wallet address whose fungible positions will be fetched.
   * @param options Optional options for the request.
   * @returns A promise resolving to the wallet's fungible token positions.
   */
  getFungiblePositions(
    walletAddress: string,
    options?: FungibleOptions
  ): Promise<PositionData[]>;

  /**
   * Fetches the NFT positions of a specific wallet.
   * @param walletAddress The wallet address whose NFT positions will be fetched.
   * @returns A promise resolving to the wallet's NFT positions.
   */
  fetchNFTs(walletAddress: string): Promise<NFTPosition[]>;

  /**
   * Fetches native token data.
   * @param chains Chain data obtained from ZerionAPI.getChains
   * @param params Optional restriction to static data and selected chains.
   * @returns A promise resolving to a lookup for native assets by chain ID.
   */
  getNativeTokens(
    chains: ChainData[],
    params?: {
      useStatic?: boolean;
      supportedChains?: number[];
    }
  ): Promise<Record<string, FungibleTokenData>>;
}

export interface iZerionUI {
  /**
   * Fetches and transforms a wallet's balances into a dashboard-friendly format.
   * Includes chain information, token balances, and USD values.
   * @param walletAddress The wallet address to fetch balances for
   * @returns A promise resolving to the formatted dashboard response
   */
  getUserBalances(
    walletAddress: string,
    params?: {
      fungibleOptions?: FungibleOptions;
      options?: UserBalanceOptions;
    }
  ): Promise<UserDashboardResponse>;
}
