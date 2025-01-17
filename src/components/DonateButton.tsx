import { usePrivy } from '@privy-io/react-auth';
import { ConnectWalletPrompt } from './ConnectWalletPrompt'

export function DonateButton({ projectId }: { projectId: string }) {
  const { ready, authenticated, user } = usePrivy()
  
  const isWalletConnected = ready && authenticated && !!user?.wallet?.address

  if (!isWalletConnected) {
    return (
      <ConnectWalletPrompt 
        message="请先连接钱包进行捐赠"
        size="md"
      />
    )
  }

  return (
    <button 
      onClick={() => {/* 处理捐赠逻辑 */}}
      className="px-6 py-3 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
    >
      捐赠
    </button>
  )
} 