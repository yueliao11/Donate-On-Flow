export function ConnectPrompt() {
  const { isConnected } = useWallet()
  const { openConnectModal } = useConnectModal()

  if (isConnected) {
    return null
  }

  return (
    <button
      onClick={openConnectModal}
      className="px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
    >
      Connect Wallet to Start
    </button>
  )
} 