import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Project,
  Donation,
  getProjectsByCreator,
  getDonationsByDonor,
  updateMilestoneStatus,
  updateProjectStatus
} from '../lib/supabase';

interface DonationWithProject extends Donation {
  project: Pick<Project, 'id' | 'title' | 'status' | 'category' | 'image_url'>;
}

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [donations, setDonations] = React.useState<DonationWithProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'projects' | 'donations'>('projects');

  React.useEffect(() => {
    console.log('UserDashboard: Current user:', user);
    if (!user?.addr) {
      console.log('UserDashboard: No user address, redirecting to home');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        console.log('UserDashboard: Fetching data for address:', user.addr);
        const [projectsData, donationsData] = await Promise.all([
          getProjectsByCreator(user.addr),
          getDonationsByDonor(user.addr)
        ]);
        console.log('UserDashboard: Fetched projects:', projectsData);
        console.log('UserDashboard: Fetched donations:', donationsData);
        setProjects(projectsData);
        setDonations(donationsData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.addr, navigate]);

  const handleUpdateMilestone = async (milestoneId: number, status: 'PENDING' | 'ACTIVE' | 'COMPLETED') => {
    try {
      await updateMilestoneStatus(milestoneId, status);
      const updatedProjects = await getProjectsByCreator(user!.addr);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Failed to update milestone status');
    }
  };

  const handleUpdateProject = async (projectId: number, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await updateProjectStatus(projectId, status);
      const updatedProjects = await getProjectsByCreator(user!.addr);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Dashboard
        </h1>
        <Link
          to="/create-project"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Project
        </Link>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            My Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'donations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            My Donations ({donations.length})
          </button>
        </nav>
      </div>

      {activeTab === 'projects' ? (
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start creating your first charity project to make a difference.
              </p>
              <Link
                to="/create-project"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Link to={`/project/${project.id}`} className="hover:text-blue-600">
                        {project.title}
                      </Link>
                    </h3>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.current_amount} / {project.target_amount} FUSD</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(project.current_amount / project.target_amount) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {project.status === 'ACTIVE' && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleUpdateProject(project.id, 'COMPLETED')}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleUpdateProject(project.id, 'CANCELLED')}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {donations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Donations Yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start supporting projects to make a difference.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        donation.project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : donation.project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.project.status}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {donation.project.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <Link to={`/project/${donation.project.id}`} className="hover:text-blue-600">
                        {donation.project.title}
                      </Link>
                    </h3>

                    <div className="text-sm text-gray-500">
                      <p>Amount: {donation.amount} FUSD</p>
                      <p>Date: {new Date(donation.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-4">
                      <a
                        href={`https://testnet.flowscan.org/transaction/${donation.transaction_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Transaction
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
