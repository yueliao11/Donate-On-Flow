import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as fcl from '@onflow/fcl';
import { Project, Milestone, getProjectById, getProjectMilestones, createDonation, updateProjectAmount } from '../lib/supabase';
import { DonationHistory } from '../components/DonationHistory';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = React.useState<Project | null>(null);
  const [milestones, setMilestones] = React.useState<Milestone[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [donationAmount, setDonationAmount] = React.useState('');

  const fetchProjectData = async () => {
    try {
      if (!id) return;
      
      const projectData = await getProjectById(parseInt(id));
      if (!projectData) return;
      
      setProject(projectData);
      
      const milestonesData = await getProjectMilestones(parseInt(id));
      setMilestones(milestonesData);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.addr) {
      alert('Please connect your wallet first');
      return;
    }

    if (!project) {
      alert('Project not found');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      const transactionId = await fcl.mutate({
        cadence: `
          import CharityProject from 0x945c254064cc292c35FA8516AFD415a73A0b23A0
          import FUSD from 0x9a0766d93b6608b7

          transaction(projectId: UInt64, amount: UFix64) {
            prepare(signer: AuthAccount) {
              let vaultRef = signer.borrow<&FUSD.Vault>(from: /storage/fusdVault)
                ?? panic("Could not borrow reference to the owner's Vault!")

              let donation <- vaultRef.withdraw(amount: amount)
              CharityProject.donate(projectId: projectId, donation: <-donation)
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(id, t.UInt64),
          arg(donationAmount, t.UFix64),
        ],
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      await fcl.tx(transactionId).onceSealed();
      
      // Update Supabase records
      await createDonation({
        project_id: parseInt(id),
        donor_address: user.addr,
        amount: parseFloat(donationAmount),
        transaction_id: transactionId,
      });

      const newAmount = project.current_amount + parseFloat(donationAmount);
      await updateProjectAmount(parseInt(id), newAmount);
      
      // Refresh project data
      fetchProjectData();
      setDonationAmount('');
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    return (project.current_amount / project.target_amount) * 100;
  };

  const getCurrentMilestone = () => {
    const progress = getProgressPercentage();
    return milestones.find(m => progress < m.percentage) || milestones[milestones.length - 1];
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {project.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{project.current_amount} / {project.target_amount} FUSD</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              About This Project
            </h2>
            <p className="text-gray-600">
              {project.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Milestones
            </h2>
            <div className="space-y-4">
              {milestones.map((milestone, index) => {
                const currentMilestone = getCurrentMilestone();
                const isCurrentMilestone = milestone.id === currentMilestone?.id;
                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border ${
                      isCurrentMilestone
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">
                        Milestone {index + 1}: {milestone.percentage}%
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          milestone.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : milestone.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {milestone.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Required: {milestone.required_amount} FUSD</span>
                      <span>Current: {milestone.current_amount} FUSD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {project.status === 'ACTIVE' && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Make a Donation
              </h2>
              {user?.loggedIn ? (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount (FUSD)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        step="0.01"
                        min="0"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Donate Now
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Please connect your wallet to make a donation
                  </p>
                  <button
                    onClick={() => alert('Please connect your wallet first')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-8 mt-8">
            <DonationHistory projectId={parseInt(id!)} />
          </div>
        </div>
      </div>
    </div>
  );
};
