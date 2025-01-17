import { usePrivy } from '@privy-io/react-auth';

export const LoginWithPrivy = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center">
      {authenticated ? (
        <div className="text-center">
          {user?.email && (
            <p className="text-gray-600">
              Welcome, <span className="font-medium">{user?.email?.address}</span>!
            </p>
          )}
          <p className="text-gray-600">
            Connected wallet: <span className="font-medium">{user?.wallet?.address}</span>
          </p>
          <button
            onClick={logout}
            className="mt-4 px-6 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg 
                     shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 
                     focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2" 
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
          Connect Wallet
        </button>
      )}
    </div>
  );
}; 