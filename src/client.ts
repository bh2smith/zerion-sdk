import { iZerionAPI, iZerionUI } from "./types/interface";
import {
  ChainData,
  FungiblePositionsResponse,
  FungibleResponse,
  FungibleTokenData,
  GetPortfolioResponse,
  PortfolioData,
  PositionData,
  UserBalanceOptions,
  UserDashboardResponse,
  FungibleOptions,
  NFTResponse,
  NFTPosition,
  NFTPositionOptions,
  GetChainsResponse,
  ListFungiblesResponse,
} from "./types";
import { transformPositionDataToUserDashboardResponse } from "./transform/ui";
import {
  STATIC_CHAINS_MAINNET,
  STATIC_NATIVE_TOKENS_MAINNET,
  STATIC_CHAINS_TESTNET,
  STATIC_NATIVE_TOKENS_TESTNET,
  ZerionService,
} from "./services/zerion";
import { DEFAULT_FUNGIBLE_OPTIONS, POLYGON_NATIVE_ASSET_ID } from "./config";
import {
  buildQueryString,
  isNativeAsset,
  polygonNativeAssetImplementation,
} from "./util";
import { Address } from "viem";

export class ZerionAPI implements iZerionAPI {
  service: ZerionService;
  readonly isTestnet: boolean;
  readonly ui: iZerionUI;

  constructor(apiKey: string, testnet: boolean = false) {
    this.service = new ZerionService(apiKey, testnet);
    this.isTestnet = testnet;
    this.ui = new ZerionUI(this);
  }

  async getChains(useStatic?: boolean): Promise<ChainData[]> {
    if (useStatic) {
      return this.isTestnet ? STATIC_CHAINS_TESTNET : STATIC_CHAINS_MAINNET;
    }
    const { data } =
      await this.service.fetchFromZerion<GetChainsResponse>("/chains/");
    return data;
  }

  async getPortfolio(
    walletAddress: string,
    currency: string = "usd"
  ): Promise<PortfolioData> {
    const { data } = await this.service.fetchFromZerion<GetPortfolioResponse>(
      `/wallets/${walletAddress}/portfolio?currency=${currency}`
    );
    return data;
  }

  async getFungiblePositions(
    walletAddress: string,
    options: FungibleOptions = DEFAULT_FUNGIBLE_OPTIONS
  ): Promise<PositionData[]> {
    const { filterPositions, filterTrash, sort, currency } = options;
    const { data } =
      await this.service.fetchFromZerion<FungiblePositionsResponse>(
        `/wallets/${walletAddress}/positions/?filter[positions]=${filterPositions}&currency=${currency}&filter[trash]=${filterTrash}&sort=${sort}`
      );

    data.map((position) => {
      if (position.relationships.fungible.data.id === POLYGON_NATIVE_ASSET_ID) {
        position.attributes.fungible_info.implementations =
          polygonNativeAssetImplementation();
      }
    });
    return data;
  }

  // https://developers.zerion.io/reference/listfungibles
  async listFungibles(
    address: string,
    chain?: string
  ): Promise<FungibleTokenData[]> {
    let queryParams = `filter[search_query]=${address}`;
    if (chain) {
      queryParams += `&filter[implementation_chain_id]=${chain}`;
    }
    const { data } = await this.service.fetchFromZerion<ListFungiblesResponse>(
      `/fungibles?currency=usd&page[size]=100&${queryParams}&sort=-market_data.market_cap`
    );
    return data;
  }

  async fungibles(id: string): Promise<FungibleTokenData> {
    const { data } = await this.service.fetchFromZerion<FungibleResponse>(
      `/fungibles/${id}`
    );
    if (data.id === "7560001f-9b6d-4115-b14a-6c44c4334ef2") {
      data.attributes.implementations = polygonNativeAssetImplementation();
    }
    return data;
  }

  async fetchNFTs(
    walletAddress: string,
    options?: NFTPositionOptions
  ): Promise<NFTPosition[]> {
    if (this.isTestnet) {
      console.warn(
        "This endpoint is not supported for testnet. Returning empty list"
      );
      return [];
    }

    // Base parameters
    const baseParams = {
      currency: options?.currency || "usd",
      "page[size]": options?.pageSize || 100,
      "filter[chain_ids]": options?.network,
      "filter[collection]": options?.collection,
      "filter[category]": options?.category,
      "filter[status]": options?.status,
      "page[number]": options?.pageNumber,
      sort: options?.sort,
      include: options?.include,
    };

    const { data } = await this.service.fetchFromZerion<NFTResponse>(
      // TODO: Add pagination!
      `/wallets/${walletAddress}/nft-positions/?${buildQueryString(baseParams)}`
    );
    return data;
  }

  async getNativeTokens(
    chains: ChainData[],
    useStatic?: boolean
  ): Promise<Record<string, FungibleTokenData>> {
    if (useStatic)
      return Object.fromEntries(
        chains.map((chain) => [
          chain.id,
          (this.isTestnet
            ? STATIC_NATIVE_TOKENS_TESTNET
            : STATIC_NATIVE_TOKENS_MAINNET)[chain.id],
        ])
      );

    const nativeTokenResponses = await Promise.all(
      chains.map(async (chain) => {
        const nativeTokenId = chain.relationships.native_fungible.data.id;
        const tokenData = await this.fungibles(nativeTokenId);
        return { chainId: chain.id, tokenData };
      })
    );

    const nativeTokens = Object.fromEntries(
      nativeTokenResponses.map(({ chainId, tokenData }) => [chainId, tokenData])
    );

    return nativeTokens;
  }

  async getChainById(chainId: number): Promise<ChainData | undefined> {
    const chains = await this.getChains(true);
    // It is super inneficient to be filtering this every single time.
    const chain = chains.find(
      (c) => Number(c.attributes.external_id) === chainId
    );
    if (!chain) {
      console.error(`Chain with ID ${chainId} not found...`);
    }
    return chain;
  }

  async getToken(args: {
    chainId: number;
    address: Address;
  }): Promise<FungibleTokenData> {
    const { chainId, address } = args;
    const chain = await this.getChainById(chainId);
    if (isNativeAsset(address)) {
      if (!chain) {
        throw new Error(`No Chain for for chainId=${chainId}`);
      }
      return this.fungibles(chain.relationships.native_fungible.data.id);
    }
    const fungibles = await this.listFungibles(address, chain?.id);
    // console.log(`Found ${fungibles.length} tokens for ${chainId}:${address}`);
    if (fungibles.length === 0) {
      console.error(`No token found for ${chainId}:${address}`);
    }
    return fungibles[0];
  }
}

export class ZerionUI implements iZerionUI {
  private client: ZerionAPI;

  constructor(client: ZerionAPI) {
    this.client = client;
  }

  async getUserBalances(
    walletAddress: string,
    params?: {
      fungibleOptions?: FungibleOptions;
      options?: UserBalanceOptions;
      useStatic?: boolean;
    }
  ): Promise<UserDashboardResponse> {
    const { fungibleOptions: preFungibleOptions, options } = params || {};
    // Many testnet tokens are not returned by the API unless trash filter is disabled.
    const testnetOverrides =
      this.client.isTestnet && !preFungibleOptions
        ? { filterTrash: "no_filter" as const }
        : {};
    const fungibleOptions = {
      ...DEFAULT_FUNGIBLE_OPTIONS,
      ...preFungibleOptions,
      ...testnetOverrides,
    };

    const [chains, positions] = await Promise.all([
      this.client.getChains(params?.useStatic),
      this.client.getFungiblePositions(walletAddress, fungibleOptions),
    ]);

    const nativeTokens = options?.showZeroNative
      ? await (async () => {
          const supportedChains = options?.supportedChains;
          const relevantChains = supportedChains
            ? chains.filter((chain) =>
                supportedChains.includes(
                  parseInt(chain.attributes.external_id, 16)
                )
              )
            : chains;

          return this.client.getNativeTokens(relevantChains, params?.useStatic);
        })()
      : {};

    return transformPositionDataToUserDashboardResponse(
      positions,
      chains,
      {
        ...options,
        nativeTokens, // Pass native token data to transform
      },
      this.client.isTestnet
    );
  }
}
