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
      "0x8d99F8b2710e6A3B94d9bf465A98E5273069aCBd"
    );
    console.log("Balances", JSON.stringify(balances, null, 2));
  });
});
