import { FungibleOptions } from "./types";
export const ZERION_CONFIG = {
  BASE_URL: "https://api.zerion.io/v1",
} as const;

export const DEFAULT_FUNGIBLE_OPTIONS: FungibleOptions = {
  currency: "usd",
  filterPositions: "only_simple",
  filterTrash: "only_non_trash",
  sort: "value",
};
