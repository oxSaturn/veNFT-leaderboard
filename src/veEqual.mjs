import {
  fantomPublicClient,
  sonicPublicClient,
  getNFTs,
  writeMd,
} from "./veNFT.mjs";

// veEqual
const veContractAddressFantom = "0x8313f3551c4d3984ffbadfb42f780d0c8763ce94";

const fantomData = await getNFTs(fantomPublicClient, veContractAddressFantom);

writeMd(fantomData, "veEqual.md", "ftm");

const veContractAddressSonic = "0x3045119766352fF250b3d45312Bd0973CBF7235a";

const sonicData = await getNFTs(sonicPublicClient, veContractAddressSonic);

writeMd(sonicData, "veEqualSonic.md", "sonic");
