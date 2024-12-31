import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Category, Project } from '../lib/types';
import { getProjects } from '../lib/api';
import { getProjectImage } from '../utils/imageUtils';
import { ContractTest } from '../components/ContractTest';
import { SyncProjectButton } from '../components/project/SyncProjectButton';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | ''>('');
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories: (Category | 'All')[] = [
    'All',
    'Education',
    'Healthcare',
    'Environment',
    'Technology',
    'Arts & Culture'
  ];

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects with options:', {
        category: selectedCategory,
        search: searchQuery
      });
      const data = await getProjects({
        category: selectedCategory as Category,
        search: searchQuery || undefined
      });
      console.log('Fetched projects:', data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, [selectedCategory, searchQuery]);

  const getProgressPercentage = (project: Project) => {
    return (project.current_amount / project.target_amount) * 100;
  };

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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
          <p className="text-lg mb-6">
            Support meaningful projects and track their progress through milestones.
          </p>
          {user?.loggedIn ? (
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start a Project
            </Link>
          ) : (
            <button
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => alert('Please connect your wallet first')}
            >
              Connect Wallet to Start
            </button>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === 'All' ? '' : category as Category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    (category === 'All' && !selectedCategory) ||
                    category === selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={getProjectImage(project.category, project.image_url)}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 mt-2 mr-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.current_amount} / {project.target_amount} FLOW</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${getProgressPercentage(project)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/project/${project.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                  <SyncProjectButton 
                    project={project} 
                    onSync={() => fetchProjects()} 
                  />
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No projects found matching your criteria
            </div>
          )}
        </div>
      </div>
     {/* <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          Donate On Flow Testing
        </h2>
        <ContractTest />
      </div>*/}
    </div>
  );
};