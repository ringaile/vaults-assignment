const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	let Vault2;
    let vault2;
	let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

		vault2 = await Vault2.deploy();
		await vault2.deployed();
	});

	describe("Mint", function () {
		it("Should allow to mint tokens", async function () {
			let amount = 1;

			const mintTx = await vault2.connect(owner).mint(amount, { value: amount });
			await mintTx.wait();

			await expect(mintTx).to.emit(vault2, 'Minted').withArgs(owner.address, amount);
	  
			expect(await vault2.totalSupply()).to.equal(amount);
		});

		it("Should allow to mint tokens from any address", async function () {
			let amount = 1;

			const mintTx = await vault2.connect(addr1).mint(amount, { value: amount });
			await mintTx.wait();

			await expect(mintTx).to.emit(vault2, 'Minted').withArgs(addr1.address, amount);
	  
			expect(await vault2.totalSupply()).to.equal(amount);
		});
	});

	describe("Mint Errors", function () {
		it("Should not allow to mint tokens if amount is different from eth sent", async function () {
			let amount = 1;

			expect(vault2.connect(owner).mint(amount + 1, { value: amount })).to.be.revertedWith("Amount must be the same as ETH value");
	  
			expect(await vault2.totalSupply()).to.equal(0);
		});

		it("Should not allow to mint tokens if amount is zero or less", async function () {
			let amount = 0;

			expect(vault2.connect(owner).mint(amount, { value: amount })).to.be.revertedWith("No amount given");
	  
			expect(await vault2.totalSupply()).to.equal(0);
		});
	});

	describe("Burn errors", function () {
		it("Should not allow to burn tokens if amount is zero or less", async function () {
			let amount = 0;

			expect(vault2.connect(owner).burn(amount)).to.be.revertedWith("No amount given");
	  
			expect(await vault2.totalSupply()).to.equal(0);
		});
	});	

	describe("Burn", function () {
		it("Should allow to burn tokens", async function () {
			let mintAmount = 5;
			let burnAmount = 1

			const mintTx = await vault2.connect(owner).mint(mintAmount, { value: mintAmount });
			await mintTx.wait();

			await expect(mintTx).to.emit(vault2, 'Minted').withArgs(owner.address, mintAmount);
	  
			expect(await vault2.totalSupply()).to.equal(mintAmount);

			const burnTx = await vault2.connect(owner).burn(burnAmount);
			await burnTx.wait();
			
			expect(await vault2.totalSupply()).to.equal(mintAmount - burnAmount);
		});
		
		it("Should allow to burn tokens from any address", async function () {
			let mintAmount = 5;
			let burnAmount = 1

			const mintTx = await vault2.connect(addr1).mint(mintAmount, { value: mintAmount });
			await mintTx.wait();

			await expect(mintTx).to.emit(vault2, 'Minted').withArgs(addr1.address, mintAmount);
	  
			expect(await vault2.totalSupply()).to.equal(mintAmount);

			const burnTx = await vault2.connect(addr1).burn(burnAmount);
			await burnTx.wait();
			
			expect(await vault2.totalSupply()).to.equal(mintAmount - burnAmount);
		});
	});	
});
