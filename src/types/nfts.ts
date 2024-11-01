export interface NFTResponse {
  links: {
    self: string;
  };
  data: NFTPosition[];
}

export interface NFTPosition {
  type: string;
  id: string;
  attributes: {
    changed_at: string;
    amount: string;
    price?: number;
    value?: number;
    nft_info: NFTInfo;
    collection_info: CollectionInfo;
  };
  relationships: {
    chain: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
    nft: {
      data: {
        type: string;
        id: string;
      };
    };
    nft_collection: {
      data: {
        type: string;
        id: string;
      };
    };
    wallet_nft_collection: {
      data: {
        type: string;
        id: string;
      };
    };
  };
}

export interface NFTInfo {
  contract_address: string;
  token_id: string;
  name: string;
  interface: string;
  content: {
    preview?: {
      url: string;
    };
    detail?: {
      url: string;
    };
    video?: {
      url: string;
    };
  };
  flags: {
    is_spam: boolean;
  };
}

export interface CollectionInfo {
  name: string;
  description?: string;
  content: {
    icon?: {
      url: string;
    };
    banner?: {
      url: string;
    };
  };
}
