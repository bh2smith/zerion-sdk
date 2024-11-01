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
