import { writeFile } from "fs/promises";
import { ZerionAPI } from "../src/client";

const ZERION_API_KEY = process.env.ZERION_API_KEY;
if (!ZERION_API_KEY)
  throw new Error("Environment variable ZERION_API_KEY is not set");

async function write(obj: object, filename: string): Promise<void> {
  await writeFile(`./data/${filename}.json`, JSON.stringify(obj, null, 2));
}

async function main(): Promise<void> {
  const testnetZerion = new ZerionAPI(ZERION_API_KEY!, true);
  const testnetChains = await testnetZerion.getChains();
  const testnetNativeTokens =
    await testnetZerion.getNativeTokens(testnetChains);

  const mainnetZerion = new ZerionAPI(ZERION_API_KEY!, false);
  const mainnetChains = await mainnetZerion.getChains();
  const mainnetNativeTokens =
    await mainnetZerion.getNativeTokens(mainnetChains);

  await Promise.all([
    write(testnetChains, "testnet-chains"),
    write(testnetNativeTokens, "testnet-native-tokens"),
    write(mainnetChains, "mainnet-chains"),
    write(mainnetNativeTokens, "mainnet-native-tokens"),
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
