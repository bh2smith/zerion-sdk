import {
  ChainData,
  NFTPosition,
  PositionData,
  transformNftDataToUserNftResponse,
  transformPositionDataToUserDashboardResponse,
} from "../../src";

const chainResponse: ChainData[] = [
  {
    type: "chains",
    id: "optimism",
    attributes: {
      external_id: "0xa",
      name: "Optimism",
      icon: {
        url: "https://chain-icons.s3.amazonaws.com/optimism.png",
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
      explorer: {
        name: "Etherscan",
        token_url_format: "https://optimistic.etherscan.io/token/{ADDRESS}",
        tx_url_format: "https://optimistic.etherscan.io/tx/{HASH}",
        home_url: "https://optimistic.etherscan.io",
      },
      rpc: {
        public_servers_url: ["https://mainnet.optimism.io"],
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: { type: "fungibles", id: "eth" },
      },
    },
    links: { self: "https://api.zerion.io/v1/chains/optimism" },
  },
  {
    type: "chains",
    id: "ethereum",
    attributes: {
      external_id: "0x1",
      name: "Ethereum",
      icon: {
        url: "https://chain-icons.s3.amazonaws.com/ethereum.png",
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
      explorer: {
        name: "Etherscan",
        token_url_format: "https://etherscan.io/token/{ADDRESS}",
        tx_url_format: "https://etherscan.io/tx/{HASH}",
        home_url: "https://etherscan.io",
      },
      rpc: {
        public_servers_url: [
          "https://eth.llamarpc.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: { type: "fungibles", id: "eth" },
      },
    },
    links: { self: "https://api.zerion.io/v1/chains/ethereum" },
  },
  {
    type: "chains",
    id: "blast", // Chain with no balance
    attributes: {
      external_id: "0x13e31",
      name: "Blast",
      icon: {
        url: "https://chain-icons.s3.amazonaws.com/chainlist/81457",
      },
      flags: {
        supports_trading: true,
        supports_sending: true,
        supports_bridge: true,
      },
      explorer: {
        name: "Blastscan",
        token_url_format: "https://blastscan.io/token/{ADDRESS}",
        tx_url_format: "https://blastscan.io/tx/{HASH}",
        home_url: "https://blastscan.io",
      },
      rpc: {
        public_servers_url: ["https://rpc.blast.io/"],
      },
    },
    relationships: {
      native_fungible: {
        links: {
          related: "https://api.zerion.io/v1/fungibles/eth",
        },
        data: { type: "fungibles", id: "eth" },
      },
    },
    links: { self: "https://api.zerion.io/v1/chains/blast" },
  },
];

const positionsResponse: PositionData[] = [
  {
    type: "positions",
    id: "eth-optimism",
    attributes: {
      parent: null,
      protocol: null,
      name: "Asset",
      position_type: "wallet",
      quantity: {
        int: "2524605152734832372",
        decimals: 18,
        float: 2.5246051527348325,
        numeric: "2.524605152734832372",
      },
      value: 6667.835653094075,
      price: 2641.14,
      fungible_info: {
        name: "Ethereum",
        symbol: "ETH",
        icon: { url: "https://cdn.zerion.io/eth.png" },
        flags: { verified: true },
        implementations: [],
      },
      flags: { displayable: true, is_trash: false },
      changes: undefined,
      updated_at: "",
      updated_at_block: 0,
    },
    relationships: {
      chain: {
        links: {
          related: "",
        },
        data: { type: "chains", id: "optimism" },
      },
      fungible: {
        links: {
          related: "",
        },
        data: { type: "fungibles", id: "eth" },
      },
    },
  },
  {
    type: "positions",
    id: "flt-ethereum",
    attributes: {
      parent: null,
      protocol: null,
      name: "Asset",
      position_type: "wallet",
      quantity: {
        int: "5000000000000000000000",
        decimals: 18,
        float: 5000,
        numeric: "5000.000000000000000000",
      },
      value: 1387.2587850000002,
      price: 0.277451757,
      fungible_info: {
        name: "Fluence",
        symbol: "FLT",
        icon: null, // Position with no icon
        flags: { verified: true },
        implementations: [],
      },
      flags: { displayable: true, is_trash: false },
      changes: undefined,
      updated_at: "",
      updated_at_block: 0,
    },
    relationships: {
      chain: {
        data: { type: "chains", id: "ethereum" },
        links: {
          related: "",
        },
      },
      fungible: {
        links: {
          related: "",
        },
        data: { type: "fungibles", id: "flt" },
      },
    },
  },
];

const nftsResponse: NFTPosition[] = [
  {
    type: "nft_positions",
    id: "0x8d99f8b2710e6a3b94d9bf465a98e5273069acbd:ethereum:0x22c1f6050e56d2876009903609a2cc3fef83b415:8521",
    attributes: {
      changed_at: "2022-11-07T10:07:59Z",
      amount: "1",
      price: 9.143193239999999,
      value: 9.143193239999999,
      nft_info: {
        contract_address: "0x22c1f6050e56d2876009903609a2cc3fef83b415",
        token_id: "8521",
        name: "Solidity Summit 2020",
        interface: "ERC721",
        content: {
          preview: {
            url: "https://lh3.googleusercontent.com/sqcn_IGO_qHKTyb57JFf4DXxpUpEJ_xMnNfX4VB-wsUhJ2lmNn69iXmItIiJ7svjk0LTkYNEsNWlIlAegqsMySASrDMhb_d3Nw=s250",
          },
          detail: {
            url: "https://lh3.googleusercontent.com/sqcn_IGO_qHKTyb57JFf4DXxpUpEJ_xMnNfX4VB-wsUhJ2lmNn69iXmItIiJ7svjk0LTkYNEsNWlIlAegqsMySASrDMhb_d3Nw",
          },
        },
        flags: {
          is_spam: false,
        },
      },
      collection_info: {
        name: "POAP",
        description: "The Proof of Attendance Protocol",
        content: {
          icon: {
            url: "https://lh3.googleusercontent.com/tOzkCPkfPuwnhNfb4thFA_6xiojAFHTNEPuCYnZS3q3GF4zNneOxowGQNpOI5Gr_-fVYC5eBFIf79HQvtsyEDpVRW2olLdlnPg",
          },
        },
      },
    },
    relationships: {
      chain: {
        links: {
          related: "https://api.zerion.io/v1/chains/ethereum",
        },
        data: {
          type: "chains",
          id: "ethereum",
        },
      },
      nft: {
        data: {
          type: "nfts",
          id: "ethereum:0x22c1f6050e56d2876009903609a2cc3fef83b415:8521",
        },
      },
      nft_collection: {
        data: {
          type: "nft_collections",
          id: "474",
        },
      },
      wallet_nft_collection: {
        data: {
          type: "wallet_nft_collections",
          id: "0x8d99f8b2710e6a3b94d9bf465a98e5273069acbd:474",
        },
      },
    },
  },
  {
    type: "nft_positions",
    id: "0x8d99f8b2710e6a3b94d9bf465a98e5273069acbd:optimism:0xee13783d5a85d9ffe196ab3912bff0f30e4e5165:12",
    attributes: {
      changed_at: "2024-10-01T07:38:31Z",
      amount: "1",
      price: 0,
      nft_info: {
        contract_address: "0xee13783d5a85d9ffe196ab3912bff0f30e4e5165",
        token_id: "12",
        name: "Introducing Ethereum Blobspace Derivatives 12",
        interface: "ERC721",
        content: {
          preview: {
            url: "https://lh3.googleusercontent.com/3uLM9gDfOLWkTYqaIUr5wc5-yUXL3G-9Ua0i-YzZapbBpnmgkJhGlsash4HI0m8CPnNdGk5MvMBWExO6L6jchnyev4yQ-i-sbfM=s250",
          },
          detail: {
            url: "https://lh3.googleusercontent.com/3uLM9gDfOLWkTYqaIUr5wc5-yUXL3G-9Ua0i-YzZapbBpnmgkJhGlsash4HI0m8CPnNdGk5MvMBWExO6L6jchnyev4yQ-i-sbfM",
          },
        },
        flags: {
          is_spam: false,
        },
      },
      collection_info: {
        name: "Introducing Ethereum Blobspace Derivatives",
        description:
          "https://mirror.xyz/10/0xee13783d5a85d9ffe196ab3912bff0f30e4e5165",
        content: {
          icon: {
            url: "https://lh3.googleusercontent.com/3uLM9gDfOLWkTYqaIUr5wc5-yUXL3G-9Ua0i-YzZapbBpnmgkJhGlsash4HI0m8CPnNdGk5MvMBWExO6L6jchnyev4yQ-i-sbfM",
          },
        },
      },
    },
    relationships: {
      chain: {
        links: {
          related: "https://api.zerion.io/v1/chains/optimism",
        },
        data: {
          type: "chains",
          id: "optimism",
        },
      },
      nft: {
        data: {
          type: "nfts",
          id: "optimism:0xee13783d5a85d9ffe196ab3912bff0f30e4e5165:12",
        },
      },
      nft_collection: {
        data: {
          type: "nft_collections",
          id: "969394213",
        },
      },
      wallet_nft_collection: {
        data: {
          type: "wallet_nft_collections",
          id: "0x8d99f8b2710e6a3b94d9bf465a98e5273069acbd:969394213",
        },
      },
    },
  },
];

describe("Near Safe Requests", () => {
  it("gets Chains", async () => {
    const uiBalances = transformPositionDataToUserDashboardResponse(
      positionsResponse,
      chainResponse
    );
    expect(uiBalances.chains).toStrictEqual(["Optimism", "Ethereum"]);
    expect(uiBalances.totalUsdBalance).toBe(8055.094438094075);

    expect(uiBalances.chainsIcons).toStrictEqual({
      // Arbitrum: "https://chain-icons.s3.amazonaws.com/arbitrum.png",
      // Base: "https://chain-icons.s3.amazonaws.com/chainlist/8453",
      Ethereum: "https://chain-icons.s3.amazonaws.com/ethereum.png",
      // "Gnosis Chain": "https://chain-icons.s3.amazonaws.com/xdai.png",
      Optimism: "https://chain-icons.s3.amazonaws.com/optimism.png",
      // Polygon: "https://chain-icons.s3.amazonaws.com/polygon.png",
    });
    expect(uiBalances.tokens).toStrictEqual([
      {
        chain: {
          chainId: 10,
          chainName: "Optimism",
          chainIcon: "https://chain-icons.s3.amazonaws.com/optimism.png",
        },
        balances: {
          balance: 2.5246051527348325,
          usdBalance: 6667.835653094075,
          price: 2641.14,
        },
        meta: {
          name: "Ethereum",
          symbol: "ETH",
          decimals: 18,
          isSpam: false,
          tokenIcon: "https://cdn.zerion.io/eth.png",
        },
      },
      {
        chain: {
          chainId: 1,
          chainName: "Ethereum",
          chainIcon: "https://chain-icons.s3.amazonaws.com/ethereum.png",
        },
        balances: {
          balance: 5000,
          usdBalance: 1387.2587850000002,
          price: 0.277451757,
        },
        meta: { name: "Fluence", symbol: "FLT", decimals: 18, isSpam: false },
      },
    ]);
  });
});

describe("NFT Transformations", () => {
  it("transforms Zerion NFT data to Bitte FE format", async () => {
    const userNftResponse = transformNftDataToUserNftResponse(
      nftsResponse,
      chainResponse
    );
    expect(userNftResponse.chains).toStrictEqual(["Ethereum", "Optimism"]);
    expect(userNftResponse.totalNfts).toBe(2);

    expect(userNftResponse.chainsIcons).toStrictEqual({
      // Arbitrum: "https://chain-icons.s3.amazonaws.com/arbitrum.png",
      // Base: "https://chain-icons.s3.amazonaws.com/chainlist/8453",
      Ethereum: "https://chain-icons.s3.amazonaws.com/ethereum.png",
      // "Gnosis Chain": "https://chain-icons.s3.amazonaws.com/xdai.png",
      Optimism: "https://chain-icons.s3.amazonaws.com/optimism.png",
      // Polygon: "https://chain-icons.s3.amazonaws.com/polygon.png",
    });

    expect(userNftResponse.nfts).toStrictEqual([
      {
        nft_contract_id: "0x22c1f6050e56d2876009903609a2cc3fef83b415",
        token_id: "8521",
        minter: null,
        owner: null,
        base_uri: null,
        metadata_id: null,
        title: "Solidity Summit 2020",
        description: null,
        media:
          "https://lh3.googleusercontent.com/sqcn_IGO_qHKTyb57JFf4DXxpUpEJ_xMnNfX4VB-wsUhJ2lmNn69iXmItIiJ7svjk0LTkYNEsNWlIlAegqsMySASrDMhb_d3Nw",
        reference: null,
        reference_blob: null,
        minted_timestamp: null,
        last_transfer_timestamp: null,
        price: "9.143193239999999",
        currency: null,
        chain: "Ethereum",
      },
      {
        nft_contract_id: "0xee13783d5a85d9ffe196ab3912bff0f30e4e5165",
        token_id: "12",
        minter: null,
        owner: null,
        base_uri: null,
        metadata_id: null,
        title: "Introducing Ethereum Blobspace Derivatives 12",
        description: null,
        media:
          "https://lh3.googleusercontent.com/3uLM9gDfOLWkTYqaIUr5wc5-yUXL3G-9Ua0i-YzZapbBpnmgkJhGlsash4HI0m8CPnNdGk5MvMBWExO6L6jchnyev4yQ-i-sbfM",
        reference: null,
        reference_blob: null,
        minted_timestamp: null,
        last_transfer_timestamp: null,
        price: "0",
        currency: null,
        chain: "Optimism",
      },
    ]);
  });
});
