import { iZerionAPI, iZerionUI } from "./types/interface";
import {
  ChainData,
  FungiblePositionsResponse,
  FungibleResponse,
  FungibleTokenData,
  GetChainsResponse,
  GetPortfolioResponse,
  PortfolioData,
  PositionData,
  UserBalanceOptions,
  UserDashboardResponse,
  FungibleOptions,
} from "./types";
import { transformPositionDataToUserDashboardResponse } from "./transform/ui";
import { ZerionService } from "./services/zerion";
import { DEFAULT_FUNGIBLE_OPTIONS } from "./config";

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
    return data;
  }

  async fungibles(id: string): Promise<FungibleTokenData> {
    const { data } = await this.service.fetchFromZerion<FungibleResponse>(
      `/fungibles/${id}`
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

    // If showZeroNative, fetch native token info for relevant chains
    let nativeTokens: Record<string, FungibleResponse["data"]> = {};
    if (options?.showZeroNative) {
      const supportedChains = options?.supportedChains;
      const relevantChains = supportedChains
        ? chains.filter((chain) =>
            supportedChains.includes(parseInt(chain.attributes.external_id, 16))
          )
        : chains;

      const nativeTokenResponses = await Promise.all(
        relevantChains.map(async (chain) => {
          const nativeTokenId = chain.relationships.native_fungible.data.id;
          const tokenData = await this.client.fungibles(nativeTokenId);
          return { chainId: chain.id, tokenData };
        })
      );

      nativeTokens = Object.fromEntries(
        nativeTokenResponses.map(({ chainId, tokenData }) => [
          chainId,
          tokenData,
        ])
      );
    }

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
