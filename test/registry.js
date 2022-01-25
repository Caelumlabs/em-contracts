const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CaelumRegistry', function () {
  it('Should Deploy the Registry', async function () {
    const Registry = await ethers.getContractFactory('CaelumRegistry');
    const registry = await Registry.deploy('Caelum Registry', 'CMR', 'https://');
    await registry.deployed();
  });

  xit('Should mint an NFT with level 0', async () => {})
  xit('Should NOT mint an NFT with level 0 with the same address', async () => {})
  xit('Owner Should approve one NFT -> Level 1', async () => {})
  xit('Level 1 NFTs can add hashes', async () => {})
  xit('A hash can be revoked', async () => {})
  xit('Check transfers are not allowed', async () => {})

});
