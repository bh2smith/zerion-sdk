export interface FungibleImplementation {
  chain_id: string;
  address: string | null; // Address could be null (native assets)
  decimals: number;
}

export interface MarketData {
  total_supply: number;
  circulating_supply: number;
  market_cap: number;
  fully_diluted_valuation: number;
  price: number;
  changes: {
    percent_1d: number;
    percent_30d: number;
    percent_90d: number;
    percent_365d: number;
  };
}

export interface ChartRelationship {
  links: {
    related: string;
  };
  data: {
    type: "fungible_charts";
    id: string;
  };
}

export interface FungibleTokenData {
  type: "fungibles";
  id: string;
  attributes: {
    name: string;
    symbol: string;
    description: string;
    icon: {
      url: string;
    };
    flags: {
      verified: boolean;
    };
    external_links: string[];
    implementations: FungibleImplementation[];
    market_data: MarketData;
  };
  relationships: {
    chart_day: ChartRelationship;
    chart_hour: ChartRelationship;
    chart_max: ChartRelationship;
    chart_month: ChartRelationship;
    chart_week: ChartRelationship;
    chart_year: ChartRelationship;
  };
}

export interface FungibleResponse {
  links: {
    self: string;
  };
  data: FungibleTokenData;
}

export interface ListFungiblesResponse {
  links: {
    self: string;
  };
  data: FungibleTokenData[];
}
