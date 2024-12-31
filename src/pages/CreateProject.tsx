import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';
import { Category, createProject } from '../lib/supabase';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { connected, walletAddress, charityContract } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState<Category>('Education');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, navigate]);

  const categories: Category[] = [
    'Education',
    'Healthcare',
    'Environment',
    'Technology',
    'Arts & Culture'
  ];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !walletAddress || !charityContract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      // 获取最低保证金金额
      const minimumFee = await charityContract.getMinimumFee();
      console.log('Minimum fee:', ethers.utils.formatEther(minimumFee), 'ETH');
      
      // 创建项目并支付保证金
      const tx = await charityContract.createProject(
        title,
        description,
        ethers.utils.parseEther(targetAmount),
        { 
          value: minimumFee,
          gasLimit: 500000 // 添加固定的 gas limit
        }
      );

      // 等待交易确认
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // 从交易收据中获取项目ID
      const projectCreatedEvent = receipt.events?.find(
        (event) => event.event === 'ProjectCreated'
      );
      
      if (!projectCreatedEvent) {
        throw new Error('Failed to get project ID from transaction');
      }

      const projectId = projectCreatedEvent.args.projectId.toNumber();
      console.log('Created project ID:', projectId);

      // 创建 Supabase 记录
      await createProject({
        title,
        description,
        target_amount: parseFloat(targetAmount),
        category,
        image_url: imageUrl,
        creator_address: walletAddress,
        status: 'ACTIVE',
        chain_project_id: projectId,
        minimum_fee_paid: true
      });

      // 导航到仪表板
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating project:', error);
      if (error.data) {
        console.error('Error data:', error.data);
      }
      alert(error.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>

      {!connected ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Please connect your wallet to create a project
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="targetAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Target Amount (FLOW)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="targetAmount"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};