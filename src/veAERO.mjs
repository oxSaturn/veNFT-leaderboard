import { basePublicClient, getNFTs, writeMd } from "./veNFT.mjs";

const veContractAddress = "0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4";

const data = await getNFTs(basePublicClient, veContractAddress, 1024n);

writeMd(data, "veAERO.md", "base");
