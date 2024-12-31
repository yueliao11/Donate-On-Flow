import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';

interface Project {
  id: number;
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  owner: string;
  isOnChain: boolean;
}

interface ContractTestProps {
  className?: string;
}

export const ContractTest: React.FC<ContractTestProps> = ({ className }) => {
  const { connected, walletAddress, charityContract, logIn, signer } = useAuth();
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState<string>('0');
  const [projects, setProjects] = useState<Project[]>([]);
  const [syncingProject, setSyncingProject] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (signer && walletAddress) {
        try {
          const balance = await signer.getBalance();
          setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('0');
        }
      }
    };

    fetchBalance();
  }, [signer, walletAddress]);

  const checkProjectOnChain = async (projectId: number): Promise<boolean> => {
    if (!charityContract) return false;
    try {
      const project = await charityContract.projects(projectId);
      return project.title !== ''; // 如果标题不为空，说明项目存在
    } catch (error) {
      return false;
    }
  };

  const fetchProjects = async () => {
    if (!charityContract) return;

    try {
      const projectCount = await charityContract.getProjectCount();
      const projectsData: Project[] = [];

      for (let i = 0; i < projectCount.toNumber(); i++) {
        try {
          const project = await charityContract.projects(i);
          const isOnChain = await checkProjectOnChain(i);
          projectsData.push({
            id: i,
            title: project.title,
            description: project.description,
            targetAmount: ethers.utils.formatEther(project.targetAmount),
            currentAmount: ethers.utils.formatEther(project.currentAmount),
            owner: project.owner,
            isOnChain
          });
        } catch (error) {
          console.error(`Error fetching project ${i}:`, error);
        }
      }

      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    if (connected && charityContract) {
      fetchProjects();
    }
  }, [charityContract, connected, success]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !walletAddress || !charityContract) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await charityContract.createProject(
        projectTitle,
        projectDescription,
        ethers.utils.parseEther(targetAmount)
      );
      await tx.wait();
      setSuccess(`Project created successfully! Transaction: ${tx.hash}`);
      
      // 清空表单
      setProjectTitle('');
      setProjectDescription('');
      setTargetAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !walletAddress || !charityContract) {
      setError('Please connect your wallet first');
      return;
    }

    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!projectId || parseInt(projectId) < 0 || parseInt(projectId) >= projects.length) {
      setError('Please enter a valid project ID');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tx = await charityContract.donate(projectId, {
        value: ethers.utils.parseEther(donateAmount)
      });
      
      await tx.wait();
      setSuccess(`Donation successful! Transaction: ${tx.hash}`);
      
      // 清空表单
      setDonateAmount('');
      setProjectId('');
    } catch (err: any) {
      setError(err.message || 'Failed to donate');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (project: Project) => {
    if (!connected || !walletAddress || !charityContract) {
      setError('Please connect your wallet first');
      return;
    }

    setSyncingProject(project.id);
    setError('');
    setSuccess('');

    try {
      const tx = await charityContract.createProject(
        project.title,
        project.description,
        ethers.utils.parseEther(project.targetAmount)
      );
      await tx.wait();
      setSuccess(`Project ${project.id} synced successfully! Transaction: ${tx.hash}`);
      await fetchProjects(); // 刷新项目列表
    } catch (err: any) {
      setError(`Failed to sync project ${project.id}: ${err.message}`);
    } finally {
      setSyncingProject(null);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Wallet Status</h3>
        <div className="mt-2 text-sm text-gray-600">
          <p>Status: {connected ? 'Connected' : 'Not Connected'}</p>
          {connected && (
            <>
              <p>Address: {walletAddress}</p>
              <p>Balance: {parseFloat(balance).toFixed(4)} FLOW</p>
            </>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Contract Test Panel</h2>
      
      {/* 状态显示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Processing transaction...
        </div>
      )}

      {/* 项目列表 */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Available Projects</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">ID: {project.id}</p>
                    <p className="text-lg font-semibold">{project.title}</p>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p>Target: {parseFloat(project.targetAmount).toFixed(2)} FLOW</p>
                    <p>Current: {parseFloat(project.currentAmount).toFixed(2)} FLOW</p>
                    <button
                      onClick={() => handleSync(project)}
                      disabled={project.isOnChain || syncingProject === project.id}
                      className={`mt-2 px-4 py-2 text-sm font-medium rounded-md ${
                        project.isOnChain
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : syncingProject === project.id
                          ? 'bg-blue-400 text-white cursor-wait'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {project.isOnChain
                        ? 'Synced'
                        : syncingProject === project.id
                        ? 'Syncing...'
                        : 'Sync to Chain'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Owner: {project.owner}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 创建项目表单 */}
      <form onSubmit={handleCreateProject} className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create Project</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Amount (FLOW)
            </label>
            <input
              type="number"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !connected}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            Create Project
          </button>
        </div>
      </form>

      {/* 捐款表单 */}
      <form onSubmit={handleDonate}>
        <h3 className="text-xl font-semibold mb-4">Make Donation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project ID
            </label>
            <input
              type="number"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Please select a project ID from the list above
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (FLOW)
            </label>
            <input
              type="number"
              step="0.01"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !connected}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            Make Donation
          </button>
        </div>
      </form>
    </div>
  );
};
