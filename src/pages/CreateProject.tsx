import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectFormData, FormStep } from '../types/form';
import { BasicInfoStep } from '../components/form/BasicInfoStep';
import { StoryStep } from '../components/form/StoryStep';
import { WalletStep } from '../components/form/WalletStep';

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  targetAmount: 0,
  endDate: '',
  category: '',
  coverImage: ''
};

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleWalletConnected = async (address: string) => {
    // Here you would typically:
    // 1. Create the project on the blockchain
    // 2. Save project data to your backend
    console.log('Creating project with wallet:', address);
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep === 'basic') setCurrentStep('story');
    else if (currentStep === 'story') setCurrentStep('wallet');
  };

  const prevStep = () => {
    if (currentStep === 'story') setCurrentStep('basic');
    else if (currentStep === 'wallet') setCurrentStep('story');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Project
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {currentStep === 'basic' && (
            <BasicInfoStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'story' && (
            <StoryStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 'wallet' && (
            <WalletStep onWalletConnected={handleWalletConnected} />
          )}

          <div className="flex justify-between mt-8">
            {currentStep !== 'basic' && (
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {currentStep !== 'wallet' && (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};