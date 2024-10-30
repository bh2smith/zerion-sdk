export type UserDashboardResponse = {
  tokens: UserToken[];
  totalUsdBalance: number;
  chains: string[];
  chainsIcons: ChainIcons;
};

export type ChainIcons = { [key: string]: string };

export type UserToken = {
  chain: UserTokenChain;
  balances: UserTokenBalance;
  meta: UserTokenMeta;
};

export interface UserTokenChain {
  chainId?: number; // undefined is Near
  chainName: string;
  chainIcon?: string;
}
export interface UserTokenBalance {
  balance: number;
  usdBalance: number;
  price?: number;
}
export interface UserTokenMeta {
  name: string;
  symbol: string;
  decimals: number;
  tokenIcon?: string;
  contractAddress?: string;
  isSpam: boolean;
}
