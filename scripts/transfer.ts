import { ethers } from "hardhat";
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const addr = process.env.ADDRESS_TO
  const provider = new ethers.providers.JsonRpcProvider(process.env.LOCALHOST_URL);
  let wallet = new ethers.Wallet(`0x${process.env.LOCALHOST_SEED}`);
  wallet = wallet.connect(provider);
  const tx = {
    to: addr,
    value: ethers.utils.parseEther("10.0")
  }
  await wallet.sendTransaction(tx)
  console.log(`10 ETH transfered to ${addr}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
