const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 1", () => {
	let Vault1;
    let vault1;
    let TestToken;
	let testToken;
	let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;
	const tokenSupply = 10000000000000;

	beforeEach(async () => {
		Vault1 = await ethers.getContractFactory("Vault1");
		TestToken = await ethers.getContractFactory("ERC20TestToken");
		[owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

		testToken = await TestToken.deploy();
		vault1 = await Vault1.deploy(testToken.address);

		await testToken.deployed();
		await vault1.deployed();

		const approveTx = await testToken.connect(owner).approve(owner.address, tokenSupply);
    	// wait until the transaction is mined
    	await approveTx.wait();
	});

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
		  expect(await vault1.owner()).to.equal(owner.address);
		});
	});

	describe("Deposit", function () {
		it("Should allow to deposit ERC20 compatible token", async function () {
			let amount = 1;
			expect((await testToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
	  
			const approveTx = await testToken.connect(owner).approve(vault1.address, amount);
			await approveTx.wait();
	  
			const depositTx= await vault1.connect(owner).deposit(amount);
			await depositTx.wait();
	  
			await expect(depositTx).to.emit(vault1, 'Deposited').withArgs(owner.address, testToken.address, amount);
	  
			expect((await testToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply-amount);
			expect((await testToken.balanceOf(vault1.address)).toNumber()).to.equal(amount);
		});

		it("Should allow to deposit ERC20 compatible token from not an owner address", async function () {
			let addr1Balance = 5;
			let amount = 1;

			const approveTx = await testToken.connect(owner).approve(addr1.address, addr1Balance);
			await approveTx.wait();

			const transferTx = await testToken.transferFrom(owner.address, addr1.address, addr1Balance);
			await transferTx.wait();

			expect((await testToken.balanceOf(addr1.address)).toNumber()).to.equal(addr1Balance);

			const approveVault1Tx = await testToken.connect(addr1).approve(vault1.address, amount);
			await approveVault1Tx.wait();

			const depositTx = await vault1.connect(addr1).deposit(amount);
			await depositTx.wait();

			await expect(depositTx).to.emit(vault1, 'Deposited').withArgs(addr1.address, testToken.address, amount);
			
			expect((await testToken.balanceOf(addr1.address)).toNumber()).to.equal(addr1Balance-amount);
			expect((await testToken.balanceOf(vault1.address)).toNumber()).to.equal(amount);
		});
	});

	describe("Withdraw", function () {
		it("Should allow to withdraw a token", async function () {    
			let amount = 1;
	
			const approveTx = await testToken.connect(owner).approve(vault1.address, amount);
			await approveTx.wait();
	
			const depositTx = await vault1.connect(owner).deposit(amount);
			await depositTx.wait();

			await expect(depositTx).to.emit(vault1, 'Deposited').withArgs(owner.address, testToken.address, amount);
	  
			const withdrawTx = await vault1.connect(owner).withdraw(amount);
			await withdrawTx.wait();
	
			await expect(withdrawTx).to.emit(vault1, 'Withdrawn').withArgs(owner.address, testToken.address, amount);
	
			expect((await testToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply);
			expect((await testToken.balanceOf(vault1.address)).toNumber()).to.equal(0);
		});
	});

	it("Should allow to allow to withdraw a token from not an owner address", async function () {
		let addr1Balance = 5;
		let amount = 1;

		const approveTx = await testToken.connect(owner).approve(addr1.address, addr1Balance);
		await approveTx.wait();

		const transferTx = await testToken.transferFrom(owner.address, addr1.address, addr1Balance);
		await transferTx.wait();

		expect((await testToken.balanceOf(addr1.address)).toNumber()).to.equal(addr1Balance);

		const approveVault1Tx = await testToken.connect(addr1).approve(vault1.address, amount);
		await approveVault1Tx.wait();

		const depositTx = await vault1.connect(addr1).deposit(amount);
		await depositTx.wait();

		await expect(depositTx).to.emit(vault1, 'Deposited').withArgs(addr1.address, testToken.address, amount);

		const withdrawTx = await vault1.connect(addr1).withdraw(amount);
		await withdrawTx.wait();
	
		await expect(withdrawTx).to.emit(vault1, 'Withdrawn').withArgs(addr1.address, testToken.address, amount);
	
		expect((await testToken.balanceOf(addr1.address)).toNumber()).to.equal(addr1Balance);
		expect((await testToken.balanceOf(vault1.address)).toNumber()).to.equal(0);
	});

	it("Should not allow to withdraw more tokens than deposited", async function () {    
		let depositAmount = 1;
		let withdrawAmount = 2;

		const approveTx = await testToken.connect(owner).approve(vault1.address, withdrawAmount);
		await approveTx.wait();

		const depositTx = await vault1.connect(owner).deposit(depositAmount);
		await depositTx.wait();

		await expect(depositTx).to.emit(vault1, 'Deposited').withArgs(owner.address, testToken.address, depositAmount);
  
		expect(vault1.withdraw(owner.address)).to.be.revertedWith("Contract balance is too low");

		expect((await testToken.balanceOf(owner.address)).toNumber()).to.equal(tokenSupply - depositAmount);
		expect((await testToken.balanceOf(vault1.address)).toNumber()).to.equal(depositAmount);
	});
});
