// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {ethers}=require('ethers');

async function getBalances(address){
  const balance=await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balance);
}

async function consoleBalances(addresses){
  for(const address of addresses){
    console.log(`Address ${address} Balance:`,await getBalances(address))
  }
}

async function main() {
  const [deployer]=await hre.ethers.getSigners()
  const marketplace=await hre.ethers.getContractFactory("Marketplace")
  const contract=await marketplace.deploy()
  
  await contract.waitForDeployment()

  console.log("Address of contract:",await contract.getAddress())

  const transaction=await contract.connect(deployer).addProduct("iphone","mobile",1,0)

  await transaction.wait()

  console.log("transaction done")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
