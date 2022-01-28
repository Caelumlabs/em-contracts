const { ethers } = require('hardhat');
const { expect } = require('chai');

const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN_ROLE'));

const getMetadata = (_uri) => {
  const uri = _uri.split(',')
  expect(uri[0]).to.equal('data:application/json;base64')
  let json = Buffer.from(uri[1], 'base64').toString('ascii')
  json = JSON.parse(json)
  return json;
}

describe('CaelumRegistry', function () {
  let owner, org1, org2;
  let registry;
  let hash;

  before('deploying', async () => {
    [owner, org1, org2 ] = await ethers.getSigners();
  });
  it('Should Deploy the Registry', async function () {
    const [owner] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory('CaelumRegistry');
    registry = await Registry.connect(owner).deploy('Caelum Registry', 'CMR', 'https://');
    await registry.deployed();
  });

  it('Should mint an NFT with level 0', async () => {
    expect( await registry.owner() ).to.equal(owner.address);
    const tx = await registry.connect(owner).mint();
    const receipt = await tx.wait();
    const args = receipt.events?.filter((x) => {return (x.event === 'Transfer')});
    const tokenId = parseInt(args[0].args['tokenId']);
    expect( tokenId ).to.equal(0);
    expect( await registry.owner() ).to.equal(owner.address);
    const uri = await registry.tokenURI(0);
    const json = getMetadata(uri);
    expect(json.name).to.equal('DID #0');
    expect(json.level).to.equal(0);

  })
  it('Should NOT mint an NFT with level 0 with the same address', async () => {
    await expect(registry.connect(owner).mint()).to.be.revertedWith("Organisation already exists");

  })

  it('Owner Should approve one NFT -> Level 1', async () => {
    await registry.connect(owner).setLevel(0,2);
    const uri = await registry.tokenURI(0);
    const json = getMetadata(uri);
    expect(json.name).to.equal('DID #0');
    expect(json.level).to.equal(2);
  });

  it('Level 1 NFTs can add hashes', async () => {
    await registry.connect(org1).mint();
    await registry.connect(owner).setLevel(1,1);
    hash = await org1.signMessage('Hello world');
    await registry.connect(org1).addCertificate(1, hash);
	const verify = await registry.verifyCertificate(1, hash);
    expect(verify.validTo).to.equal(0);
    expect(verify.validFrom).to.not.equal(0);
  })

  it('A hash can be revoked', async () => {
	await registry.connect(org1).revokeCertificate(1, hash);
	const verify = await registry.verifyCertificate(1, hash);
    expect(verify.validTo).to.not.equal(0);
    expect(verify.validFrom).to.not.equal(0);
  })

  it('Only owner can add/revoke certificates', async () => {
    await expect(registry.connect(org2).addCertificate(1, hash)).to.be.revertedWith('Only owner can add certificates');
    await expect(registry.connect(org2).revokeCertificate(1, hash)).to.be.revertedWith('Only owner can revoke certificates');
  })

  it('Transfers are not allowed', async () => {
    await expect(registry.connect(org1).transferFrom(org1.address, org2.address, 1)).to.be.revertedWith('Transfer is not allowed');
  })

});
