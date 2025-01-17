import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

export function ConnectWalletButton() {
  const { account, connect, disconnect, isConnected } = useWallet();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        {isConnected ? `断开连接 (${account?.slice(0,6)}...)` : '连接钱包'}
      </button>

      {isConnected && (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleEnterDashboard}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            进入控制台
          </button>
          {/* 可以添加更多入口按钮 */}
        </div>
      )}
    </div>
  );
} 