import { arbitrumPublicClient, getNFTs, writeMd } from "./veNFT.mjs";

const veContractAddress = "0x44ccA4FB1737F6A5DEb2AC1Bc1F3D4075bBF9db4";

const data = await getNFTs(arbitrumPublicClient, veContractAddress);

writeMd(data, "veHRA.md", "arb");
