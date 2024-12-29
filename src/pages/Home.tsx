import React, { useState } from 'react';
import { ProjectGrid } from '../components/project/ProjectGrid';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/project/CategoryFilter';
import { SortSelect } from '../components/project/SortSelect';
import { DonationModal } from '../components/project/DonationModal';
import { useProjects } from '../hooks/useProjects';
import { donateToProject } from '../services/api/projects';
import { TelegramLoginButton } from '../components/shared/TelegramLoginButton';
import { StatisticsCard } from '../components/shared/StatisticsCard';
import { LeaderboardCard } from '../components/shared/LeaderboardCard';
import { CommunityUpdates } from '../components/shared/CommunityUpdates';
import { DonationLeaderboard } from '../components/donation/DonationLeaderboard';
import { CommunityVoting } from '../components/community/CommunityVoting';
import { ProjectEvaluation } from '../components/project/ProjectEvaluation';
import { Link } from 'react-router-dom';
import { TelegramUser } from '../components/TelegramUser';
import { useAuthContext } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { telegramUser } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'ending'>('latest');
  const [donationTimeframe, setDonationTimeframe] = useState<'all' | 'week' | 'month'>('all');
  const [activeTab, setActiveTab] = useState<'projects' | 'community' | 'evaluation'>('projects');
  const [donationModal, setDonationModal] = useState<{
    show: boolean;
    projectId: string;
    projectTitle: string;
  }>({ show: false, projectId: '', projectTitle: '' });

  const { projects, loading, error } = useProjects(searchQuery, selectedCategory, sortBy);

  const handleDonate = async (amount: number) => {
    try {
      await donateToProject(donationModal.projectId, amount);
      setDonationModal({ show: false, projectId: '', projectTitle: '' });
    } catch (err) {
      console.error('Failed to donate:', err);
    }
  };

  // Mock data for demonstration
  const mockDonations = [
    {
      donor: 'Alice',
      amount: 1000,
      tokenType: 'FLOW',
      timestamp: new Date(),
      projectTitle: 'Education Fund'
    },
    // Add more mock donations...
  ];

  const mockProposals = [
    {
      id: '1',
      title: 'Community Fund Allocation',
      description: 'How should we allocate the community fund for Q1 2024?',
      options: ['Education', 'Healthcare', 'Environment'],
      votes: [45, 30, 25],
      startTime: new Date(),
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'active' as const
    },
    // Add more mock proposals...
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
        <p className="text-xl mb-6">Join our decentralized charity platform powered by Flow blockchain</p>
        <div className="flex gap-4">
          <Link to="/create-project" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
            Start a Project
          </Link>
          <TelegramLoginButton />
        </div>
      </div>

      {/* Telegram User Information */}
      <TelegramUser />

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticsCard title="Total Donations" value="1,234,567 FLOW" />
        <StatisticsCard title="Active Projects" value="156" />
        <StatisticsCard title="Total Donors" value="45,678" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'projects'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'community'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Community
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'evaluation'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Evaluation
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <SearchBar onSearch={setSearchQuery} />
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-grow">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              <ProjectGrid
                projects={projects}
                loading={loading}
                error={error}
                onDonate={(projectId) => {
                  const project = projects.find(p => p.id === projectId);
                  if (project) {
                    setDonationModal({
                      show: true,
                      projectId,
                      projectTitle: project.title
                    });
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'community' && (
            <CommunityVoting
              proposals={mockProposals}
              onVote={(proposalId, optionIndex) => {
                console.log('Voted:', proposalId, optionIndex);
              }}
              onCreateProposal={(proposal) => {
                console.log('Created proposal:', proposal);
              }}
            />
          )}

          {activeTab === 'evaluation' && (
            <div className="space-y-8">
              {projects.map(project => (
                <ProjectEvaluation
                  key={project.id}
                  projectId={project.id}
                  onSubmit={(evaluation) => {
                    console.log('Submitted evaluation:', evaluation);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <DonationLeaderboard
            donations={mockDonations}
            timeframe={donationTimeframe}
            onTimeframeChange={setDonationTimeframe}
          />
          <CommunityUpdates />
        </div>
      </div>

      {donationModal.show && (
        <DonationModal
          projectId={donationModal.projectId}
          projectTitle={donationModal.projectTitle}
          onDonate={handleDonate}
          onClose={() => setDonationModal({ show: false, projectId: '', projectTitle: '' })}
        />
      )}
    </div>
  );
};