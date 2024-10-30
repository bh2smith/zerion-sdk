import {
  ChainData,
  PositionData,
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
