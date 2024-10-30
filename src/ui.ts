import { ChainData, PositionData } from "./types";

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

interface MinChainData {
  name: string;
  icon?: string;
  zerionId: string;
  numberId: number;
}

// Transform position data to user dashboard response
export function transformPositionDataToUserDashboardResponse(
  positions: PositionData[],
  // This part is only used for chain icons (it is basically static input)
  chains: ChainData[]
): UserDashboardResponse {
  // Create a map of chains for O(1) access
  const chainMap = new Map<string, MinChainData>();
  chains.forEach((chain) => {
    chainMap.set(chain.id, {
      name: chain.attributes.name,
      icon: chain.attributes.icon.url,
      numberId: parseInt(chain.attributes.external_id, 16),
      zerionId: chain.id,
    });
  });

  let totalUsdBalance = 0;
  const chainSet = new Set<string>();
  const chainsIcons: ChainIcons = {};
  const tokens: UserToken[] = positions.map((position) => {
    const { attributes, relationships } = position;

    // Extract chain info
    const chain = chainMap.get(relationships.chain.data.id)!;
    chainsIcons[chain.name] = chain.icon!;
    chainSet.add(chain.name);

    // Update total USD balance
    totalUsdBalance += attributes.value || 0;
    // Get chain icon from zerion.getChains.
    const chainIcon = chain.icon;
    const contractAddress =
      attributes.fungible_info.implementations[0]?.address;
    const tokenIcon = attributes.fungible_info.icon?.url;
    // Extract balances and token metadata
    const userToken: UserToken = {
      chain: {
        chainId: chain.numberId,
        chainName: chain.name,
        ...(chainIcon ? { chainIcon } : {}),
      },
      balances: {
        balance: attributes.quantity.float,
        usdBalance: attributes.value || 0,
        ...(attributes.price ? { price: attributes.price } : {}),
      },
      meta: {
        name: attributes.fungible_info.name,
        symbol: attributes.fungible_info.symbol,
        decimals: attributes.quantity.decimals,
        isSpam: attributes.flags.is_trash,
        ...(tokenIcon ? { tokenIcon } : {}),
        ...(contractAddress ? { contractAddress } : {}),
      },
    };

    return userToken;
  });

  return {
    tokens,
    totalUsdBalance,
    chains: Array.from(chainSet),
    chainsIcons,
  };
}
