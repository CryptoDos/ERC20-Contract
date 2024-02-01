import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  BaseContract,
  Contract,
  ContractRunner,
  ContractTransactionResponse,
} from "ethers";
import { ethers } from "hardhat";

describe("Token", function () {
  let token: Contract;

  async function deploy() {
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    return token;
  }

  beforeEach(async function () {
    token = await loadFixture(deploy);
  });

  describe("deploy", function () {
    it("should be named TEST", async function () {
      expect(await token.name()).to.eq("TEST");
    });

    it("should have TEST symbol", async function () {
      expect(await token.symbol()).to.eq("TEST");
    });

    it("should have  a total supply of 100,000", async function () {
      expect(await token.getTotalSupply()).to.eq(ethers.parseEther("100000"));
    });

    it("should mint total supply to deployer", async function () {
      const [deployer] = await ethers.getSigners();
      expect(await token.balanceOf(deployer.address)).to.eq(
        ethers.parseEther("100000")
      );
    });
  });

  describe("transfer", function () {
    const amount = ethers.parseEther("1");

    it("should transfer emits event", async function () {
      const [from, to] = await ethers.getSigners();
      await expect(token.transfer(to.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(from, to, amount);

      // changeTokenBalances(token, [from, to], [amount, amount]);
    });
    it("should transfer amount from a specific account", async function () {
      const [deployer, account0, account1] = await ethers.getSigners();
      // first we will transfer 100 to account0 (from the deployer)
      await token.transfer(account0.address, 50);

      const account0Balance = await token.balanceOf(account0.address);

      expect(account0Balance).to.equal(50);

      await token.connect(account0).transfer(account1.address, 50);
      const addr2Balance = await token.balanceOf(account1.address);
      expect(addr2Balance).to.equal(50);
      // next, we need to connect as account0 and approve
      // the approval will allow the deployer to send tokens
      // on behalf of account0

      //   await token.connect(deployer).approve(deployer.address, amount);
      // last, we will use transferFrom to allow the deployer to
      // transfer on behalf of account0
      // await expect(
      //   token.transferFrom(account0.address, account1.address, amount)
      // ).to.changeTokenBalances(
      //   token,
      //   [deployer, account0, account1],
      //   [0, amount, amount]
      // );
    });
  });

  describe("events", function () {
    const amount = ethers.parseEther("100");

    it("should emit Transfer event", async function () {
      const [from, to] = await ethers.getSigners();
      await expect(token.transfer(to.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(from.address, to.address, amount);
    });
    it("should emit Approval event", async function () {
      const [owner, spender] = await ethers.getSigners();
      await expect(token.approve(spender.address, amount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, spender.address, amount);
    });
  });
});

// describe("MyToken contract", function () {
//   // global vars
//   let Token;
//   let myToken: BaseContract & {
//     deploymentTransaction(): ContractTransactionResponse;
//   } & Omit<BaseContract, keyof BaseContract>;
//   let owner: { address: any };
//   let addr1: ContractRunner | null;
//   let addr2: { address: any };
//   let tokenCap = 100000000;
//   let tokenBlockReward = 50;
//   beforeEach(async function () {
//     // Get the ContractFactory and Signers here.
//     Token = await ethers.getContractFactory("Token");
//     [owner, addr1, addr2] = await ethers.getSigners();
//     myToken = await Token.deploy();
//   });
//   describe("Deployment", function () {
//     // it("Should set the right owner", async function () {
//     //   expect(await myToken.).to.equal(owner.address);
//     // });
//     it("Should assign the total supply of tokens to the owner", async function () {
//       const ownerBalance = await myToken.balanceOf(owner.address);
//       expect(await myToken.totalSupply()).to.equal(ownerBalance);
//     });
//     it("Should set the max capped supply to the argument provided during deployment", async function () {
//       const cap = await myToken.cap();
//       expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
//     });
//     it("Should set the blockReward to the argument provided during deployment", async function () {
//       const blockReward = await myToken.blockReward();
//       expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
//         tokenBlockReward
//       );
//     });
//   });
//   describe("Transactions", function () {
//     it("Should transfer tokens between accounts", async function () {
//       // Transfer 50 tokens from owner to addr1
//       await myToken.transfer(addr1.address, 50);
//       const addr1Balance = await myToken.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(50);
//       // Transfer 50 tokens from addr1 to addr2
//       // We use .connect(signer) to send a transaction from another account
//       await myToken.connect(addr1).transfer(addr2.address, 50);
//       const addr2Balance = await myToken.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });
//     it("Should fail if sender doesn't have enough tokens", async function () {
//       const initialOwnerBalance = await myToken.balanceOf(owner.address);
//       // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
//       // `require` will evaluate false and revert the transaction.
//       await expect(
//         myToken.connect(addr1).transfer(owner.address, 1)
//       ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
//       // Owner balance shouldn't have changed.
//       expect(await myToken.balanceOf(owner.address)).to.equal(
//         initialOwnerBalance
//       );
//     });
//     it("Should update balances after transfers", async function () {
//       const initialOwnerBalance = await myToken.balanceOf(owner.address);
//       // Transfer 100 tokens from owner to addr1.
//       await myToken.transfer(addr1.address, 100);
//       // Transfer another 50 tokens from owner to addr2.
//       await myToken.transfer(addr2.address, 50);
//       // Check balances.
//       const finalOwnerBalance = await myToken.balanceOf(owner.address);
//       expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
//       const addr1Balance = await myToken.balanceOf(addr1.address);
//       expect(addr1Balance).to.equal(100);
//       const addr2Balance = await myToken.balanceOf(addr2.address);
//       expect(addr2Balance).to.equal(50);
//     });
//   });
// });
