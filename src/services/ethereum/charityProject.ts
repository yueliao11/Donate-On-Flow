// src/services/ethereum/charityProject.ts
import { ethers } from 'ethers';
import { CharityProject__factory } from '../../types/factories/CharityProject__factory';

export class CharityProjectService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(contractAddress: string, signer: ethers.Signer) {
    this.contract = CharityProject__factory.connect(contractAddress, signer);
    this.signer = signer;
  }

  async createProject(
    title: string,
    description: string,
    targetAmount: string,
    milestoneDescriptions: string[],
    milestoneAmounts: string[]
  ) {
    const tx = await this.contract.createProject(
      title,
      description,
      ethers.utils.parseEther(targetAmount),
      milestoneDescriptions,
      milestoneAmounts.map(amount => ethers.utils.parseEther(amount))
    );
    return await tx.wait();
  }

  async donate(projectId: number, amount: string) {
    const tx = await this.contract.donate(projectId, {
      value: ethers.utils.parseEther(amount)
    });
    return await tx.wait();
  }
}