// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const CharityProject = await ethers.getContractFactory("CharityProject");
  const charityProject = await CharityProject.deploy();
  await charityProject.deployed();

  console.log("CharityProject deployed to:", charityProject.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});