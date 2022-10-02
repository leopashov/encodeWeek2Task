import { ethers } from "ethers";
import * as dotenv from "dotenv";
import abi from '../ABI.json';
//import { abi } from "../artifacts/contracts/ballot.sol/Ballot.json";

dotenv.config();

async function main() {

    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY,

    };

    const provider = ethers.getDefaultProvider("goerli", options);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Using address ${wallet.address}`);
    const signer = wallet.connect(provider);
    // const signer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider); // alt
    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error('Not enough Eth!')
    };

    // get deployed contract instance
    const contractAddress = "0x005d0434eEe49719672f28df17a4eb4cfa7469D6";
    // const contractInterface = new Interface(abi);
    // console.log({ contractInterface })

    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    console.log({ contractInstance })


    // Casting vote
    // console.log('Cast vote');
    // const castVoteTx = await contractInstance.vote(2); // takes proposal index
    // const castVoteTxReceipe = await castVoteTx.wait();
    // console.log({ castVoteTxReceipe });


    // // // Delegation - voting rights 
    // console.log(`Delegation`);
    // const selectedVoter = "0x889EAE789177B319161397CDeCe70F0049dD9Add"; // address to delegate to 
    // const delegateVoteTx = await contractInstance.delegate(selectedVoter);
    // const delegateVoteTxReceipe = await delegateVoteTx.wait();
    // console.log({ delegateVoteTxReceipe });

    // voteForAdresse1 = await contractInstance.voters(selectedVoter);
    // console.log({ voteForAdresse1 });


    // // query winning proposal 
    console.log(`Query Winning Proposal`);
    const winningProposalIndex = await contractInstance.winningProposal();
    const winningProposalObject = await contractInstance.proposals(winningProposalIndex);
    const winningProposalName = await contractInstance.winnerName();

    console.log(`name of Proposal: ${winningProposalName}`);
    console.log(`No. of votes: ${winningProposalObject.voteCount}`);

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});