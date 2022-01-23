const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let Vault2;
    let vault2;
    let TestToken;
	let testToken;
	let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;
	const tokenSupply = 10000000000000;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();

		// const approveTx = await testToken.connect(vault2).approve(vault2.address, tokenSupply);
    	// await approveTx.wait();
	});

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
		  expect(await vault2.owner()).to.equal(owner.address);
		});
	});
});
