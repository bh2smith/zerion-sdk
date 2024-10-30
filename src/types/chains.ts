import { Links } from "./common";

// Interface for the getChains response
export interface GetChainsResponse {
  links: Links;
  data: ChainData[];
}

// Interface for the chain data object
export interface ChainData {
  type: string;
  id: string;
  attributes: ChainAttributes;
  relationships: Relationships;
  links: Links;
}

// Interface for the relationships section
export interface Relationships {
  native_fungible: FungibleRelationship;
  wrapped_native_fungible?: FungibleRelationship; // Optional since some chains might not have this
}

// Interface for the chain's attributes
export interface ChainAttributes {
  // This is hex representation of chainId (integer)
  external_id: string;
  name: string;
  icon: Icon;
  explorer: Explorer;
  rpc: Rpc;
  flags: Flags;
}

// Interface for the fungible relationships
export interface FungibleRelationship {
  data: { type: string; id: string };
  links: Links;
}

// Interface for the explorer URLs
export interface Explorer {
  name: string;
  token_url_format: string;
  tx_url_format: string;
  home_url: string;
}

// Interface for the RPC URLs
export interface Rpc {
  public_servers_url: string[];
}

// Interface for the chain's flags
export interface Flags {
  supports_trading: boolean;
  supports_sending: boolean;
  supports_bridge: boolean;
}

// Interface for the chain icon
export interface Icon {
  url: string;
}
