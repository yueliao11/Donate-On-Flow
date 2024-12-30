import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ethers } from 'ethers';
import { CharityProjectService } from '../services/ethereum/charityProject';
import { connectWallet } from '../services/ethereum/config';
import { Category, createProject } from '../lib/supabase';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { user, connected } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState<Category>('Education');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('0');

  // Calculate deposit amount (10% of target amount)
  useEffect(() => {
    if (targetAmount) {
      const target = parseFloat(targetAmount);
      setDepositAmount((target * 0.1).toFixed(2));
    }
  }, [targetAmount]);

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

    if (!user?.addr) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      // Connect to wallet and get signer
      const signer = await connectWallet();
      
      // Check ETH balance
      const balance = await signer.getBalance();
      const depositAmountWei = ethers.utils.parseEther(depositAmount);
      
      if (balance.lt(depositAmountWei)) {
        alert('Insufficient ETH balance for deposit');
        return;
      }

      // Create project on Ethereum blockchain
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not found');
      }

      const charityProject = new CharityProjectService(contractAddress, signer);
      
      // Create project with deposit
      const tx = await charityProject.createProject(
        title,
        description,
        targetAmount,
        [], // milestone descriptions
        [] // milestone amounts
      );

      await tx.wait();

      // Create project in Supabase
      await createProject({
        title,
        description,
        targetAmount: parseFloat(targetAmount),
        category,
        imageUrl,
        creatorAddress: await signer.getAddress(),
        status: 'ACTIVE'
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create a New Project
      </h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Creating a project requires a deposit of 10% of the target amount ({depositAmount} ETH).
              This includes 3% platform fee and 7% refundable deposit.
              The deposit will be returned when the project reaches its goal.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCreateProject} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
            Target Amount (ETH)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="targetAmount"
              required
              min="0"
              step="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Required deposit: {depositAmount} ETH
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Project Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};