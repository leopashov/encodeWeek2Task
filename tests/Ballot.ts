import { messagePrefix } from "@ethersproject/hash";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { PromiseOrValue } from "../typechain-types/common";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  // define accounts here so can be accessed throughout test script
  // see use of let here - to allow access to other functions
  // everything after ':' was provided by vs code quickfix
  let accounts: SignerWithAddress[] | { address: PromiseOrValue<string>; }[];

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
    accounts = await ethers.getSigners();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      // cant get whole array of proposal names -> not how getter functions work.
      // need to iterate through array and get elements one at a time
      for (let index = 0; index < PROPOSALS.length; index++) {
        // 'const' types are blockscoped - therefore a new 'const' value is created
        // (/old one is overwritten) for each loop of this 'for' 
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]);
      }
    });

    it("has zero votes for all proposals", async function () {
      // access proposals via smart contract
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        console.log(proposal)
        expect(proposal.voteCount).to.eq(0);
      }
    });
    it("sets the deployer's address as chairperson", async function () {
      // const accounts = await ethers.getSigners();
      const chairPerson = await ballotContract.chairperson();
      expect(chairPerson).to.eq(accounts[0].address);
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      //define chairperson using getter function
      const _chairperson = await ballotContract.chairperson();
      // get chairperson voter object
      // access mapping entries using parentheses
      const chairVote = await ballotContract.voters(_chairperson)
      expect(await chairVote.weight).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      // const accounts = await ethers.getSigners();
      const tx = await ballotContract.giveRightToVote(accounts[1].address);
      // Don't know if 'wait' is required
      tx.wait(1);
      expect(await (await ballotContract.voters(accounts[1].address)).weight).to.eq(1);
    });
    it("cannot give right to vote for someone that has voted", async function () {
      // set account[1] 'voted' to 'true
      // cant do - array is read only
      // const account1 = await ballotContract.voters(accounts[1].address);
      // account1.voted = true;
      // give right to vote
      const txReceipt = await ballotContract.giveRightToVote(accounts[1].address);
    });
    it("cannot give right to vote to someone who already has voting rights", async function () {
      // give account voting rights
      let rightToVote = ballotContract.voters(accounts[1].address);
      console.log(rightToVote);
      const tx1 = await ballotContract.giveRightToVote(accounts[1].address);
      tx1.wait(1);
      rightToVote = ballotContract.voters(accounts[1].address);
      console.log(rightToVote);
      // try again
      expect(await ballotContract.giveRightToVote(accounts[1].address)).to.throw(Error);
    });
  });

  describe("when the voter interacts with the vote function in the contract", function () {
    // TODO
    it("should register the vote", async () => {
      const tx = await ballotContract.vote(0);
      tx.wait(1);
      expect(await (await ballotContract.proposals(0)).voteCount).to.eq(1);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("should transfer voting power", async () => {
      const account1_address = await accounts[1].address;
      const tx = await ballotContract.delegate(account1_address);
      //tx.wait(1);
      const voter1 = await ballotContract.voters(account1_address);
      const voter1Weight = voter1.weight;
      expect(await voter1Weight).to.eq(1);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});