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
  UserDashboardResponse,
} from "./types";
import { transformPositionDataToUserDashboardResponse } from "./transform/ui";
import { ZerionService } from "./services/zerion";
import { ZERION_CONFIG } from "./config";

export class ZerionAPI implements iZerionAPI {
  service: ZerionService;
  readonly ui: iZerionUI;

  constructor(apiKey: string, testnet: boolean) {
    this.service = new ZerionService(apiKey, testnet ? "testnet" : undefined);
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
    currency: string = ZERION_CONFIG.DEFAULT_CURRENCY,
    filterPositions: string = ZERION_CONFIG.DEFAULT_FILTER,
    filterTrash: string = ZERION_CONFIG.DEFAULT_TRASH_FILTER,
    sort: string = ZERION_CONFIG.DEFAULT_SORT
  ): Promise<PositionData[]> {
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

  async getUserBalances(walletAddress: string): Promise<UserDashboardResponse> {
    const [chains, positions] = await Promise.all([
      this.client.getChains(),
      this.client.getFungiblePositions(walletAddress),
    ]);

    return transformPositionDataToUserDashboardResponse(positions, chains);
  }
}
