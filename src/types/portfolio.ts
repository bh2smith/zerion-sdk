import { Links } from "./common";

// export interface for the getPortfolio response
export interface GetPortfolioResponse {
  links: Links;
  data: PortfolioData;
}

// export interface for the portfolio data object
export interface PortfolioData {
  type: string;
  id: string;
  attributes: PortfolioAttributes;
}

// export interface for the portfolio attributes
export interface PortfolioAttributes {
  positions_distribution_by_type: PositionsDistributionByType;
  positions_distribution_by_chain: PositionsDistributionByChain;
  total: TotalPositions;
  changes: PortfolioChanges;
}

// export interface for the positions distribution by type
export interface PositionsDistributionByType {
  wallet: number;
  deposited: number;
  borrowed: number;
  locked: number;
  staked: number;
}

// export interface for the positions distribution by chain
export interface PositionsDistributionByChain {
  arbitrum: number;
  base: number;
  blast: number;
  ethereum: number;
  optimism: number;
  polygon: number;
  xdai: number;
  [chain: string]: number; // Allow additional chains with string keys and number values
}

// export interface for the total positions
export interface TotalPositions {
  positions: number;
}

// export interface for the changes in the portfolio
export interface PortfolioChanges {
  absolute_1d: number;
  percent_1d: number;
}
