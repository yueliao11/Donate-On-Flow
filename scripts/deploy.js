// 替换 require
import { ethers } from "hardhat";
import dotenv from "dotenv";

// 加载 .env.local 配置
dotenv.config({ path: ".env.local" });

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // 部署合约
  const CharityProject = await ethers.getContractFactory("CharityProject");
  const charityProject = await CharityProject.deploy();

  await charityProject.deployed();

  console.log("CharityProject deployed to:", charityProject.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});