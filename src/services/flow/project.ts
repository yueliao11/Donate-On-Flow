import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';

export class FlowProjectService {
  async createProject(projectData: {
    title: string;
    description: string;
    targetAmount: number;
    endDate: string;
  }) {
    const transactionId = await fcl.mutate({
      cadence: `
        import CharityProject from 0xCharityProject

        transaction(
          title: String,
          description: String,
          targetAmount: UFix64,
          endDate: UFix64
        ) {
          prepare(signer: AuthAccount) {
            let project <- CharityProject.createProject(
              title: title,
              description: description,
              targetAmount: targetAmount,
              endDate: endDate
            )
            
            // Save the project resource
            signer.save(<-project, to: /storage/CharityProject)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(projectData.title, t.String),
        arg(projectData.description, t.String),
        arg(projectData.targetAmount.toFixed(8), t.UFix64),
        arg(new Date(projectData.endDate).getTime().toString(), t.UFix64),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    return transactionId;
  }

  async donateToProject(projectId: string, amount: number) {
    const transactionId = await fcl.mutate({
      cadence: `
        import CharityProject from 0xCharityProject

        transaction(projectId: UInt64, amount: UFix64) {
          prepare(signer: AuthAccount) {
            let project = signer.borrow<&CharityProject.ProjectResource>(
              from: /storage/CharityProject
            ) ?? panic("Could not borrow project")
            
            project.donate(amount: amount)
          }
        }
      `,
      args: (arg: any, t: any) => [
        arg(projectId, t.UInt64),
        arg(amount.toFixed(8), t.UFix64),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    return transactionId;
  }

  async getProjectDetails(projectId: string) {
    const project = await fcl.query({
      cadence: `
        import CharityProject from 0xCharityProject

        pub fun main(projectId: UInt64): CharityProject.Project {
          let project = getAccount(0xCharityProject)
            .getCapability(/public/CharityProject)
            .borrow<&CharityProject.ProjectResource{CharityProject.ProjectPublic}>()
            ?? panic("Could not borrow project")
          
          return project.getDetails()
        }
      `,
      args: (arg: any, t: any) => [arg(projectId, t.UInt64)],
    });

    return project;
  }
}
