import React from 'react';
import * as fcl from '@onflow/fcl';

interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  milestoneIndex: number;
  evidence: string;
  approvalCount: number;
  rejectionCount: number;
  status: string;
  createdAt: number;
}

export const Governance: React.FC = () => {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchProposals = async () => {
    try {
      const response = await fcl.query({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          pub fun main(): [Proposal] {
            return CharityProject.getAllProposals()
          }
        `,
      });

      setProposals(response);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: number, approve: boolean) => {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0

          transaction(proposalId: UInt64, approve: Bool) {
            prepare(signer: AuthAccount) {
              let proposal = CharityProject.borrowProposal(proposalId: proposalId)
              proposal.vote(approve: approve)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(proposalId, t.UInt64),
          arg(approve, t.Bool),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      fetchProposals();
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  React.useEffect(() => {
    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Active Proposals
        </h1>

        <div className="grid gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {proposal.projectTitle} - Milestone {proposal.milestoneIndex + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Proposal ID: {proposal.id}
                    </p>
                  </div>
                  <span
                    className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        proposal.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : proposal.status === 'APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                          : proposal.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    `}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Evidence
                  </h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {proposal.evidence}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Votes</span>
                    <span>
                      {proposal.approvalCount} Approve / {proposal.rejectionCount} Reject
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          proposal.approvalCount + proposal.rejectionCount > 0
                            ? (proposal.approvalCount /
                                (proposal.approvalCount + proposal.rejectionCount)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {proposal.status === 'ACTIVE' && (
                  <div className="flex gap-4">
                    <button
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => handleVote(proposal.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => handleVote(proposal.id, false)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {proposals.length === 0 && (
            <div className="text-center text-gray-500">
              No active proposals at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
