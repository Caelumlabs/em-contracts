import { ethers } from "hardhat";
import dotenv from 'dotenv'
dotenv.config()

const RegistryContract = require('../artifacts/contracts/Registry.sol/CaelumRegistry.json');

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.LOCALHOST_URL);
  let relayer = new ethers.Wallet('c5cc827435f1973b7f046503c5d40476601a6afd5e0694d77cc99c37b7257156');
  relayer = relayer.connect(provider);
  const nft = new ethers.Contract('0x88e642584c3BdDd8705A18b03903be87e5559244', RegistryContract.abi, relayer);
  await nft.setLevel(1,1);
  console.log("First NFT minted with level 1:", registry.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
