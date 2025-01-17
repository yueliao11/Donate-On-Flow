import { useWallet } from '../hooks/useWallet'

interface ConnectWalletPromptProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ConnectWalletPrompt({ 
  message = 'Please connect your wallet',
  size = 'md' 
}: ConnectWalletPromptProps) {
  const { isConnected, openConnectModal } = useWallet()

  if (isConnected) {
    return null
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-gray-600">{message}</p>
      <button
        onClick={openConnectModal}
        className={`font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors ${sizeClasses[size]}`}
      >
        Connect Wallet
      </button>
    </div>
  )
} 