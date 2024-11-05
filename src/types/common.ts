// Interface for the links structure
export interface Links {
  self?: string;
  related?: string;
}

export type Currencies =
  | "eth"
  | "btc"
  | "usd"
  | "eur"
  | "krw"
  | "rub"
  | "gbp"
  | "aud"
  | "cad"
  | "inr"
  | "jpy"
  | "nzd"
  | "try"
  | "zar"
  | "cny"
  | "chf";

export type PositionsFilter = "only_simple" | "only_complex" | "no_filter";
export type TrashFilter = "only_trash" | "only_non_trash" | "no_filter";

export type FungibleOptions = {
  currency: Currencies;
  filterPositions: PositionsFilter;
  filterTrash: TrashFilter;
  sort: "value" | "-value";
};

// Interface for optional query parameters to list wallet NFT positions
export interface NFTPositionOptions {
  currency?: Currencies;
  network?: string | string[]; // specify blockchain network (e.g., "ethereum", "polygon")
  collection?: string; // filter by specific collection (e.g., "BoredApeYachtClub")
  category?: "art" | "gaming" | "collectibles" | "other"; // filter by NFT category
  status?: "active" | "inactive"; // filter by status of NFT position
  pageNumber?: number; // for paginated results, specify page number
  pageSize?: number; // specify the number of items per page
  sort?: "name" | "-name" | "value" | "-value"; // sort order for results
  include?: "details" | "stats"; // include additional related data if required
}
