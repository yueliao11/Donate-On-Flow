import React, { useState, useCallback } from 'react';
import { aiService } from '../../services/ai/aiService';

interface AIEnhancedDescriptionProps {
  originalDescription: string;
  onEnhanced?: (enhancedText: string) => void;
}

export const AIEnhancedDescription: React.FC<AIEnhancedDescriptionProps> = ({
  originalDescription,
  onEnhanced
}) => {
  const [description, setDescription] = useState(originalDescription);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhanceDescription = useCallback(async () => {
    if (isEnhancing) return;
    
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await aiService.enhanceDescription(originalDescription);
      if (enhanced && enhanced !== originalDescription) {
        setDescription(enhanced);
        onEnhanced?.(enhanced);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
      setError('Failed to enhance description. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  }, [originalDescription, onEnhanced, isEnhancing]);

  const displayText = showOriginal ? originalDescription : description;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Description</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showOriginal ? 'Show Enhanced' : 'Show Original'}
          </button>
          {!showOriginal && (
            <button
              onClick={enhanceDescription}
              disabled={isEnhancing}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isEnhancing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enhancing...
                </span>
              ) : (
                'Enhance with AI'
              )}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}
      <div className="prose max-w-none bg-white p-4 rounded-md border">
        {displayText}
      </div>
    </div>
  );
};
