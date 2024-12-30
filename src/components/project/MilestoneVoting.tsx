import React from 'react';
import * as fcl from '@onflow/fcl';
import { useAuth } from '../../context/AuthContext';

interface Vote {
  voter: string;
  weight: number;
  approve: boolean;
}

interface Milestone {
  percentage: number;
  requiredAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'VOTING' | 'COMPLETED' | 'REJECTED';
  votes: Record<string, Vote>;
  approvalWeight: number;
  rejectionWeight: number;
}

interface Project {
  id: number;
  status: 'ACTIVE' | 'VOTING' | 'COMPLETED' | 'CANCELLED';
  currentMilestoneIndex: number;
  milestones: Milestone[];
}

interface MilestoneVotingProps {
  project: Project;
  onVoteSuccess?: () => void;
}

export const MilestoneVoting: React.FC<MilestoneVotingProps> = ({ project, onVoteSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const currentMilestone = project.milestones[project.currentMilestoneIndex];
  const userVote = user?.addr ? currentMilestone?.votes[user.addr] : undefined;
  const totalVoteWeight = currentMilestone ? currentMilestone.approvalWeight + currentMilestone.rejectionWeight : 0;
  const approvalPercentage = currentMilestone ? (currentMilestone.approvalWeight / totalVoteWeight) * 100 : 0;

  const handleVote = async (approve: boolean) => {
    if (!user?.addr) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProjectV2 from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          transaction(projectId: UInt64, approve: Bool) {
            prepare(signer: AuthAccount) {
              let projectRef = CharityProjectV2.borrowProject(id: projectId)
                  ?? panic("Could not borrow project reference")

              projectRef.vote(approve: approve)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(project.id, t.UInt64),
          arg(approve, t.Bool),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      onVoteSuccess?.();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentMilestone || currentMilestone.status !== 'VOTING') {
    return null;
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Milestone Voting
        </h3>
        
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Current milestone: {currentMilestone.percentage}% ({currentMilestone.currentAmount.toFixed(2)} FUSD)
          </p>
          <p className="mt-1">
            Required amount: {currentMilestone.requiredAmount.toFixed(2)} FUSD
          </p>
        </div>

        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Approval: {approvalPercentage.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  Rejection: {(100 - approvalPercentage).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${approvalPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              />
              <div
                style={{ width: `${100 - approvalPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
              />
            </div>
          </div>
        </div>

        {!userVote && (
          <div className="mt-5 space-x-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleVote(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleVote(false)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reject
            </button>
          </div>
        )}

        {userVote && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              You have voted to {userVote.approve ? 'approve' : 'reject'} this milestone.
              Your vote weight: {(userVote.weight * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
