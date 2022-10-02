import { ethers } from "ethers";
import * as dotenv from "dotenv";
import ABI from '../ABI.json';
// import { abi } from "../artifacts/contracts/ballot.sol/Ballot.json";

dotenv.config();

async function main() {
    const options = {
        alchemy: process.env.ALCHEMY_API_KEY,
        infura: process.env.INFURA_API_KEY
    };
    const provider = ethers.getDefaultProvider("goerli", options);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    // create abi (looks mor elike an interface)
    // const abi = [
    //     "function giveRightToVote(address voter) external",
    //     "function delegate(address to) external",
    //     "function vote(uint256 proposal) external",
    //     "function winningProposal() public view returns (uint256 winningProposal_)",
    //     "function winnerName() external view returns (bytes32 winnerName_)"
    // ];
    // create ballot contract instance
    const ballotContract = new ethers.Contract("0x005d0434eEe49719672f28df17a4eb4cfa7469D6", ABI, signer);
    console.log(await ballotContract.chairperson);
    // give voting rights to 0xEB92E3D17fCc40513D14BC3b7E6AA47d93b68765
    // await ballotContract.giveRightToVote("0xEB92E3D17fCc40513D14BC3b7E6AA47d93b68765");
    const TomVote = await ballotContract.voters("0xEB92E3D17fCc40513D14BC3b7E6AA47d93b68765")
    console.log(await TomVote.weight);
    // delegate my vote to thomas
    const delegateTx = await ballotContract.delegate("0xEB92E3D17fCc40513D14BC3b7E6AA47d93b68765");
    //console.log(await TomVote.weight);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
