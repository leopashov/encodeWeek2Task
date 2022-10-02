import { ethers } from "ethers";
// connect just using ethers nicer; fewer dependencies etc
// hardhat has lots of baggage
// connect to testnet from 1:00:00
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
import { errorMonitor } from "events";
dotenv.config();

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
};

async function main() {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY
    };
    const provider = ethers.getDefaultProvider("goerli", options);
    const lastBlock = await provider.getBlock("latest");
    //console.log({lastBlock});
    //console.log("Deploying Ballot contract");
    //console.log("Proposals: ");
    //PROPOSALS.forEach((element, index) => {
    //console.log(`Proposal N. ${index + 1}: ${element}`);
    //});
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`wallet balance:  ${balance}`);
    if (balance < 0.01) {
      throw new Error("Not enough ether");
    }
    // const ballotFactory = await ethers.getContractFactory("Ballot");
    // getContractFactory (above) is a function of hardhat injected ethers.
    // when using raw ethers we must use:
    const ballotFactory = new Ballot__factory(signer);
    const ballotContract = await ballotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
    console.log("Contract deployed to:" + ballotContract.address)
    // for (let index = 0; index < PROPOSALS.length; index++) {
    // const proposal = await ballotContract.proposals(index);
    // const name = ethers.utils.parseBytes32String(proposal.name);
    // console.log({ index, name, proposal });
    // }
    // const chairperson = await ballotContract.chairperson();
    // console.log({chairperson});
    // console.log({ address0: accounts[0].address, address1: accounts[1].address});
    // console.log("Giving right to vote to address1");
    // // dont need to connect to account 0 as we are already controllling acocunt 0 by default
    // const giveRightToVoteTx = await ballotContract.giveRightToVote(accounts[1].address);
    // const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
    // console.log(giveRightToVoteTxReceipt);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});