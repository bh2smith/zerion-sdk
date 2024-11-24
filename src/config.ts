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

export const POLYGON_NATIVE_ASSET_ID = "7560001f-9b6d-4115-b14a-6c44c4334ef2";
