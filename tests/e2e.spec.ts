import dotenv from "dotenv";

import { ZerionAPI } from "../src";

dotenv.config();

const apiKey = process.env.ZERION_API_KEY;
if (!apiKey) {
  throw new Error("ZERION_API_KEY is not defined");
}

describe("Near Safe Requests", () => {
  it("fails with invalid API key", async () => {
    const zerion = new ZerionAPI("poop", true);

    await expect(zerion.getChains()).rejects.toThrow(
      "Failed to fetch /chains/: Unauthorized"
    );
  });

  it.skip("gets Chains", async () => {
    const zerion = new ZerionAPI(apiKey, true);
    const chains = await zerion.getChains();
    expect(chains.length).toBeGreaterThan(3);
    console.log(JSON.stringify(chains, null, 2));
  });

  it.skip("getFungiblePositions", async () => {
    const zerion = new ZerionAPI(apiKey, false);
    const balances = await zerion.getFungiblePositions(
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA"
    );
    console.log("Balances", JSON.stringify(balances, null, 2));
  });

  it.skip("fungibles", async () => {
    const zerion = new ZerionAPI(apiKey, false);
    const polygonNativeAsset = await zerion.fungibles(
      "7560001f-9b6d-4115-b14a-6c44c4334ef2"
    );
    expect(polygonNativeAsset.attributes.implementations).toEqual([
      { address: null, chain_id: "polygon", decimals: 18 },
    ]);
  });
  it.skip("ui.getUserBalances", async () => {
    const zerion = new ZerionAPI(apiKey, false);
    const balances = await zerion.ui.getUserBalances(
      "0x54F08c27e75BeA0cdDdb8aA9D69FD61551B19BbA",
      {
        options: {
          supportedChains: [137, 100],
          // showZeroNative: true,
          // hideDust: 0.0001,
        },
      }
    );
    console.log("Balances", JSON.stringify(balances, null, 2));
  });

  it.skip("fetchNFTs", async () => {
    const zerion = new ZerionAPI(apiKey, false);
    const balances = await zerion.fetchNFTs(
      "0x8d99F8b2710e6A3B94d9bf465A98E5273069aCBd",
      { network: ["polygon"], currency: "cad" }
    );
    console.log("NFTS", JSON.stringify(balances[0], null, 2));
  });
});
