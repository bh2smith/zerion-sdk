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

  it("gets Chains", async () => {
    const zerion = new ZerionAPI(apiKey, true);
    const chains = await zerion.getChains();
    expect(chains.length).toBeGreaterThan(3);
  });
});
