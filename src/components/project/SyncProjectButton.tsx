import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ethers } from 'ethers';
import { supabase } from '../../lib/supabase';

interface SyncProjectButtonProps {
  project: {
    id: number;
    title: string;
    description: string;
    target_amount: number;
    chain_project_id?: string;
    minimum_fee_paid?: boolean;
  };
  onSync?: () => void;
}

export const SyncProjectButton: React.FC<SyncProjectButtonProps> = ({ project, onSync }) => {
  const { charityContract, signer } = useAuth();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!charityContract || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setSyncing(true);

      // 检查是否已经同步
      if (project.chain_project_id) {
        alert('Project already synced');
        return;
      }

      // 获取最小费用
      const minimumFee = await charityContract.getMinimumFee();
      console.log('Minimum fee:', ethers.utils.formatEther(minimumFee));

      // 创建项目上链
      const tx = await charityContract.createProject(
        project.title,
        project.description,
        ethers.utils.parseEther(project.target_amount.toString()),
        {
          value: minimumFee,
          gasLimit: 500000
        }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // 从事件中获取项目ID
      const event = receipt.events?.find(
        (e: any) => e.event === 'ProjectCreated'
      );
      
      if (!event) {
        throw new Error('ProjectCreated event not found');
      }

      const chainProjectId = event.args.projectId.toString();
      console.log('Chain project ID:', chainProjectId);

      // 更新数据库
      const { error } = await supabase
        .from('projects')
        .update({
          chain_project_id: chainProjectId,
          minimum_fee_paid: true
        })
        .eq('id', project.id);

      if (error) {
        throw error;
      }

      alert('Project synced successfully!');
      onSync?.();
    } catch (error) {
      console.error('Error syncing project:', error);
      alert('Failed to sync project. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing || !!project.chain_project_id}
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${
        project.chain_project_id
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : syncing
          ? 'bg-blue-100 text-blue-400'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`}
    >
      {syncing ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Syncing...
        </>
      ) : project.chain_project_id ? (
        'Synced'
      ) : (
        'Sync to Chain'
      )}
    </button>
  );
};
