const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CharityProject = await ethers.getContractFactory("CharityProject");
  const charityProject = await CharityProject.deploy();

  await charityProject.deployed();

  console.log("CharityProject deployed to:", charityProject.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});