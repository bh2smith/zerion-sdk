import { Links } from "./common";

export interface FungiblePositionsResponse {
  links: Links;
  data: PositionData[];
}

export interface PositionData {
  type: "positions";
  id: string;
  attributes: PositionAttributes;
  relationships: PositionRelationships;
}

export interface PositionAttributes {
  parent: null | string; // Could potentially be a string if there's a parent, but it's null here
  protocol: null | string; // Protocol might be null or could be defined
  name: string;
  position_type: "wallet";
  quantity: PositionQuantity;
  value: number | null; // Value might be null
  price: number;
  // TODO(bh2smith): not sure about this one yet.
  // changes: null | unknown;
  fungible_info: FungibleInfo;
  flags: PositionFlags;
  updated_at: string; // ISO date string
  updated_at_block: number;
}

export interface PositionQuantity {
  int: string; // Large integer in string format
  decimals: number;
  float: number;
  numeric: string; // Same value as float, but in string format for precision
}

export interface FungibleInfo {
  name: string;
  symbol: string;
  icon: FungibleIcon | null;
  flags: FungibleFlags;
  implementations: FungibleImplementation[];
}

export interface FungibleIcon {
  url: string;
}

export interface FungibleFlags {
  verified: boolean;
}

export interface FungibleImplementation {
  chain_id: string;
  address: string | null; // Address could be null
  decimals: number;
}

export interface PositionFlags {
  displayable: boolean;
  is_trash: boolean;
}

export interface PositionRelationships {
  chain: RelationshipData;
  fungible: RelationshipData;
}

export interface RelationshipData {
  links: {
    related: string; // URL for the related entity
  };
  data: {
    type: string; // Type of the relationship (e.g., "chains", "fungibles")
    id: string; // ID of the related entity
  };
}
