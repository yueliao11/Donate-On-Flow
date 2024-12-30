import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as fcl from '@onflow/fcl';

interface Project {
  id: number;
  creator: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
  milestones: Array<{
    id: number;
    percentage: number;
    requiredAmount: number;
    currentAmount: number;
    status: string;
    evidence: string;
  }>;
  currentMilestoneIndex: number;
}

export const ProjectManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [evidence, setEvidence] = React.useState('');

  const fetchProject = async () => {
    try {
      const response = await fcl.query({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          pub fun main(projectId: UInt64): CharityProject.Project? {
            return CharityProject.getProject(projectId: projectId)
          }
        `,
        args: (arg: any, t: any) => [arg(id, t.UInt64)],
      });

      setProject(response);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProposeMilestone = async (evidence: string) => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          transaction(projectId: UInt64, evidence: String) {
            prepare(signer: AuthAccount) {
              let project = CharityProject.borrowProject(projectId: projectId)
              project.proposeMilestone(evidence: evidence)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(id, t.UInt64),
          arg(evidence, t.String),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      fetchProject();
      setEvidence('');
    } catch (error) {
      console.error('Error proposing milestone:', error);
    }
  };

  const handleVote = async (approve: boolean) => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          transaction(projectId: UInt64, approve: Bool) {
            prepare(signer: AuthAccount) {
              let project = CharityProject.borrowProject(projectId: projectId)
              project.vote(approve: approve)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(id, t.UInt64),
          arg(approve, t.Bool),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      fetchProject();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0
          import FUSD from 0xe223d8a629e49c68

          transaction(projectId: UInt64) {
            prepare(signer: AuthAccount) {
              let project = CharityProject.borrowProject(projectId: projectId)
              let vault <- project.withdraw()
              
              // Get reference to the recipient's vault
              let receiverRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                ?? panic("Could not borrow reference to the owner's Vault!")

              // Deposit withdrawn tokens
              receiverRef.deposit(from: <-vault)
            }
          }
        `,
        args: (arg: any, t: any) => [arg(id, t.UInt64)],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      fetchProject();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <h2 className="text-xl text-red-600">
          Project not found
        </h2>
      </div>
    );
  }

  const isCreator = user?.addr === project.creator;
  const currentMilestone = project.milestones[project.currentMilestoneIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {project.title}
        </h1>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              {project.description}
            </p>
            <div className="text-sm text-gray-600">
              <p>Status: {project.status}</p>
              <p>Progress: {project.currentAmount} / {project.targetAmount} FUSD</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Project Milestones
          </h2>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-between">
              {project.milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`flex flex-col items-center ${
                    index <= project.currentMilestoneIndex
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full
                      ${
                        milestone.status === 'WITHDRAWN'
                          ? 'bg-green-100 text-green-600'
                          : index === project.currentMilestoneIndex
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                  <p className="mt-2 text-sm">
                    {(milestone.percentage * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs">
                    {milestone.currentAmount} / {milestone.requiredAmount} FUSD
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {currentMilestone && (
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Milestone Status: {currentMilestone.status}
            </h3>

            {isCreator && currentMilestone.status === 'PENDING' && (
              <div className="space-y-4">
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Evidence (IPFS hash or description)"
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                />
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => handleProposeMilestone(evidence)}
                  disabled={!evidence}
                >
                  Propose Milestone Completion
                </button>
              </div>
            )}

            {currentMilestone.status === 'PROPOSED' && !isCreator && (
              <div className="flex gap-4">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => handleVote(true)}
                >
                  Approve
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => handleVote(false)}
                >
                  Reject
                </button>
              </div>
            )}

            {isCreator && currentMilestone.status === 'APPROVED' && (
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleWithdraw}
              >
                Withdraw Funds
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
