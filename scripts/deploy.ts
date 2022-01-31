import { ethers } from "hardhat";
import dotenv from 'dotenv'
dotenv.config()

const RegistryContract = require('../artifacts/contracts/Registry.sol/CaelumRegistry.json');

async function main() {
  // We get the contract to deploy
  const Registry = await ethers.getContractFactory('CaelumRegistry');
  let registry = await Registry.deploy('Caelum Registry', 'CMR', 'https://');
  await registry.deployed();
  console.log("Registry deployed to:", registry.address);

  const provider = new ethers.providers.JsonRpcProvider(process.env.LOCALHOST_URL);
  let relayer = new ethers.Wallet(`0x${process.env.LOCALHOST_SEED}`);
  relayer = relayer.connect(provider);
  const nft = new ethers.Contract(registry.address, RegistryContract.abi, relayer);
  await nft.mint('');
  await nft.setLevel(0,2);
  console.log("First NFT minted with level 2:", registry.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
