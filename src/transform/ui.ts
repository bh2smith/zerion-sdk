import {
  ChainData,
  ChainIcons,
  FungibleImplementation,
  FungibleTokenData,
  NFTPosition,
  PositionData,
  UserBalanceOptions,
  UserDashboardResponse,
  UserNft,
  UserNftsResponse,
  UserToken,
} from "../types";

interface MinChainData {
  name: string;
  icon?: string;
  zerionId: string;
  numberId: number;
}

export interface TransformOptions extends UserBalanceOptions {
  nativeTokens?: Record<string, FungibleTokenData>;
}

// Transform position data to user dashboard response
export function transformPositionDataToUserDashboardResponse(
  positions: PositionData[],
  // This part is only used for chain icons (it is basically static input)
  chains: ChainData[],
  options?: TransformOptions,
  isTestnet?: boolean
): UserDashboardResponse {
  // Create a map of chains for O(1) access
  const chainMap = new Map<string, MinChainData>();
  chains.forEach((chain) => {
    const numberId = parseInt(chain.attributes.external_id, 16);
    // Only add chains that are supported (if filter is provided)
    if (
      !options?.supportedChains?.length ||
      options.supportedChains.includes(numberId)
    ) {
      chainMap.set(chain.id, {
        name: chain.attributes.name,
        icon: chain.attributes.icon.url,
        numberId,
        zerionId: chain.id,
      });
    }
  });

  let totalUsdBalance = 0;
  const chainSet = new Set<string>();
  const chainsIcons: ChainIcons = {};
  // Track which chains have positions
  const chainsWithPositions = new Set<string>();

  const tokens: UserToken[] = positions
    .map((position) => {
      const { attributes, relationships } = position;

      // Extract chain info
      const chain = chainMap.get(relationships.chain.data.id)!;

      // Skip if chain is not supported
      if (!chain) {
        return null;
      }
      chainsWithPositions.add(chain.zerionId);
      chainsIcons[chain.numberId] = chain.icon!;
      chainSet.add(chain.name);

      // Update total USD balance
      totalUsdBalance += attributes.value || 0;
      // Get chain icon from zerion.getChains.
      const chainIcon = chain.icon;
      const contractAddress = findImplementation(
        chain,
        attributes.fungible_info.implementations
      )?.address;

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
          // Testnet tokens are valueless we assign a fake value of 1.
          usdBalance: isTestnet
            ? attributes.quantity.float
            : attributes.value || 0,
          price: isTestnet ? 1 : (attributes.price ?? 0),
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
      // Exclude anything with value less than hideDust
      if (
        options?.hideDust &&
        userToken.balances.usdBalance < options.hideDust
      ) {
        return null;
      }

      return userToken;
    })
    .filter((token): token is UserToken => token !== null);

  // Add zero balances for native tokens where needed
  if (options?.showZeroNative && options.nativeTokens) {
    for (const [chainId, nativeToken] of Object.entries(options.nativeTokens)) {
      const chain = chainMap.get(chainId);
      if (!chain || chainsWithPositions.has(chainId)) continue;

      chainsIcons[chain.numberId] = chain.icon!;
      chainSet.add(chain.name);

      tokens.push({
        chain: {
          chainId: chain.numberId,
          chainName: chain.name,
          ...(chain.icon ? { chainIcon: chain.icon } : {}),
        },
        balances: {
          balance: 0,
          usdBalance: 0,
          price: nativeToken.attributes.market_data?.price || 0,
        },
        meta: {
          name: nativeToken.attributes.name,
          symbol: nativeToken.attributes.symbol,
          decimals:
            findImplementation(chain, nativeToken.attributes.implementations)
              ?.decimals || 18,
          isSpam: false,
          tokenIcon: nativeToken.attributes.icon?.url,
        },
      });
    }
  }

  return {
    tokens,
    totalUsdBalance,
    chains: Array.from(chainSet),
    chainsIcons,
  };
}

// Transform NFT data to user NFTs response
export function transformNftDataToUserNftResponse(
  positions: NFTPosition[],
  // This part is only used for chain icons (it is basically static input)
  chains: ChainData[],
  options?: TransformOptions
): UserNftsResponse {
  const chainsMap = (() => {
    const m: Map<string, { name: string; icon: string; numericId: number }> =
      new Map();
    chains.forEach((c) => {
      const numericId = parseInt(c.attributes.external_id, 16);
      if (
        !options?.supportedChains?.length ||
        options.supportedChains.includes(numericId)
      )
        m.set(c.id, {
          name: c.attributes.name,
          icon: c.attributes.icon.url,
          numericId,
        });
    });
    return m;
  })();

  const chainsSet: Set<string> = new Set();
  const chainsIcons: Record<string, string> = {};

  const nfts: UserNft[] = positions.map((nft) => {
    const { detail, preview, video } = nft.attributes.nft_info.content;
    const media = detail?.url || preview?.url || video?.url || null;

    const chain = chainsMap.get(nft.relationships.chain.data.id)!;
    chainsSet.add(chain.name);
    chainsIcons[chain.numericId] = chain.icon;

    return {
      nft_contract_id: nft.attributes.nft_info.contract_address,
      token_id: nft.attributes.nft_info.token_id,
      minter: null,
      owner: null,
      base_uri: null,
      metadata_id: null,
      title: nft.attributes.nft_info.name,
      description: null,
      media,
      reference: null,
      reference_blob: null,
      minted_timestamp: null,
      last_transfer_timestamp: null,
      price: nft.attributes.price?.toString() || null,
      currency: null,
      chain: chain.name,
      chain_id: chain.numericId,
    };
  });

  return {
    nfts,
    totalNfts: nfts.length,
    chains: Array.from(chainsSet),
    chainsIcons,
  };
}

function findImplementation(
  chain: MinChainData,
  implementations: FungibleImplementation[]
): FungibleImplementation | undefined {
  return implementations.find((impl) => impl.chain_id === chain.zerionId);
}
