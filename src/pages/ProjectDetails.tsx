import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';
import { Project, Milestone } from '../lib/types';
import { getProjectById, getProjectMilestones, createDonation, updateProjectAmount } from '../lib/supabase';
import { getProjectImage } from '../utils/imageUtils';
import { DonationHistory } from '../components/DonationHistory';
import { AIEnhancedDescription } from '../components/project/AIEnhancedDescription';
import { LanguageTranslator } from '../components/shared/LanguageTranslator';
import { useWallet } from '../contexts/WalletContext';
import { DonateButton } from '../components/DonateButton';
import { usePrivy } from '@privy-io/react-auth';
import { LoginWithPrivy } from '../components/LoginWithPrivy';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, charityContract, signer } = useAuth();
  const { loggedIn, walletAddress } = useWallet();
  const { authenticated, ready } = usePrivy();
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

    if (!loggedIn || !walletAddress || !charityContract || !signer) {
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
      const donationWei = ethers.utils.parseEther(donationAmount);
      
      const tx = await charityContract.donate(project.chain_project_id, {
        value: donationWei,
        gasLimit: 500000 
      });
      
      const receipt = await tx.wait();
      
      await createDonation({
        project_id: parseInt(id!),
        donor_address: walletAddress,
        amount: parseFloat(donationAmount),
        transaction_id: tx.hash,
      });

      const newAmount = project.current_amount + parseFloat(donationAmount);
      await updateProjectAmount(parseInt(id!), newAmount);
      
      fetchProjectData();
      setDonationAmount('');
      
      alert('Donation successful!');
    } catch (error) {
      console.error('Error donating:', error);
      alert('Failed to donate. Please try again.');
    }
  };

  const handleShare = () => {
    const projectUrl = window.location.href; 
    const description = 'Check out this amazing project!'; 
    const tags = '#Project #Web3'; 
    const telegramShareLink = `https://telegram.me/share/url?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(description + ' ' + tags)}`;
    window.open(telegramShareLink, '_blank'); 
  };

  const isOwner = loggedIn && project?.owner_address === walletAddress;

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
        <div className="relative h-96">
          <img
            src={getProjectImage(project.category, project.image_url)}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 mt-4 mr-4 flex gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {project.category}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{project.current_amount} / {project.target_amount} </span>
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
            <AIEnhancedDescription 
              originalDescription={project.description} 
              onEnhanced={(enhanced) => {
                setProject(prev => prev ? {...prev, description: enhanced} : null);
              }}
            />
            <div className="mt-6">
              <LanguageTranslator content={project.description} />
            </div>
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
                      <span>Required: {milestone.required_amount} FLOW</span>
                      <span>Current: {milestone.current_amount} FLOW</span>
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
              {loggedIn ? (
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount (FLOW)
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
                    className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Donate Now
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Please connect your wallet to make a donation
                  </p>
                  <LoginWithPrivy />
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-8 mt-8">
            <DonationHistory projectId={parseInt(id!)} />
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Share on Telegram
          </button>

          {loggedIn && (
            <div className="mt-6">
              <DonateButton projectId={id!} />
            </div>
          )}
          {isOwner && (
            <div className="mt-4">
              <UpdateProjectButton project={project} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
