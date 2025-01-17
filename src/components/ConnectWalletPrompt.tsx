import { useWallet } from '../hooks/useWallet'

interface ConnectWalletPromptProps {
  message: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function ConnectWalletPrompt({ 
  message, 
  size = 'md',
  onClick 
}: ConnectWalletPromptProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} bg-blue-600 text-white font-medium rounded-lg 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:ring-offset-2 transition-colors duration-200 flex items-center 
                 justify-center space-x-2`}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      <span>{message}</span>
    </button>
  );
} 