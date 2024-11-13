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
} from "./types";
import { transformPositionDataToUserDashboardResponse } from "./transform/ui";
import { CHAINS, NATIVE_TOKENS, ZerionService } from "./services/zerion";
import { DEFAULT_FUNGIBLE_OPTIONS } from "./config";
import { buildQueryString } from "./util";

export class ZerionAPI implements iZerionAPI {
  service: ZerionService;
  readonly isTestnet: boolean;
  readonly ui: iZerionUI;

  constructor(apiKey: string, testnet: boolean = false) {
    this.service = new ZerionService(apiKey, testnet);
    this.isTestnet = testnet;
    this.ui = new ZerionUI(this);
  }

  async getChains(): Promise<ChainData[]> {
    return CHAINS;
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
    return data;
  }

  async fungibles(id: string): Promise<FungibleTokenData> {
    const { data } = await this.service.fetchFromZerion<FungibleResponse>(
      `/fungibles/${id}`
    );
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
      this.client.getChains(),
      this.client.getFungiblePositions(walletAddress, fungibleOptions),
    ]);

    return transformPositionDataToUserDashboardResponse(
      positions,
      chains,
      {
        ...options,
        nativeTokens: options?.showZeroNative ? NATIVE_TOKENS : {}, // Pass native token data to transform
      },
      this.client.isTestnet
    );
  }
}
