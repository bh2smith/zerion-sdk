import dotenv from "dotenv";

import { ZerionAPI } from "../src";

describe("Invalid Key", () => {
  it("fails with invalid API key", async () => {
    const zerion = new ZerionAPI("poop", true);

    await expect(zerion.getChains()).rejects.toThrow(
      "Failed to fetch /chains/: Unauthorized"
    );
  });
});

// Requires API Key.
describe.skip("Integration Test", () => {
  function loadZerion(testnet: boolean = false): ZerionAPI {
    dotenv.config();
    const apiKey = process.env.ZERION_API_KEY;
    if (!apiKey) {
      throw new Error("ZERION_API_KEY is not defined");
    }
    return new ZerionAPI(apiKey, testnet);
  }
  it("get testnet Chains", async () => {
    const zerion = loadZerion(true);
    const chains = await zerion.getChains();
    expect(chains.length).toBeGreaterThan(3);
    console.log(JSON.stringify(chains, null, 2));
  });

  it("getFungiblePositions", async () => {
    const zerion = loadZerion();
    const balances = await zerion.getFungiblePositions(
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA"
    );
    console.log("Balances", JSON.stringify(balances, null, 2));
  });

  it("fungibles", async () => {
    const zerion = loadZerion();
    const polygonNativeAsset = await zerion.fungibles(
      "7560001f-9b6d-4115-b14a-6c44c4334ef2"
    );
    expect(polygonNativeAsset.attributes.implementations).toEqual([
      { address: null, chain_id: "polygon", decimals: 18 },
    ]);
  });

  it("ui.getUserBalances", async () => {
    const zerion = loadZerion();
    const balances = await zerion.ui.getUserBalances(
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA",
      {
        useStatic: true,
        options: {
          supportedChains: [137],
          // showZeroNative: true,
          // hideDust: 0.0001,
        },
      }
    );
    console.log("Balances", JSON.stringify(balances, null, 2));
  });

  it("fetchNFTs", async () => {
    const zerion = loadZerion();
    const balances = await zerion.fetchNFTs(
      "0x8d99F8b2710e6A3B94d9bf465A98E5273069aCBd",
      { network: ["polygon"], currency: "cad" }
    );
    console.log("NFTS", JSON.stringify(balances[0], null, 2));
  });
});
