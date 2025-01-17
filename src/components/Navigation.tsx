import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { ethers } from 'ethers'
import { 
  ChevronDownIcon, 
  WalletIcon,
  PlusCircleIcon,
  RectangleStackIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import LoginWithPrivy from './LoginWithPrivy'
import { config } from '@onflow/fcl'

const FLOW_TESTNET_CHAIN_ID = '0x221' // 545 in hex
const FLOW_TESTNET_RPC = 'https://testnet.evm.nodes.onflow.org'

const Navigation = () => {
  const { ready, authenticated, user, logout } = usePrivy()
  const [balance, setBalance] = useState<string>('')
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)

  const shortenAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  useEffect(() => {
    const checkNetworkAndBalance = async () => {
      if (ready && authenticated && user?.wallet?.address) {
        try {
          // 检查FCL网络配置
          const network = await config().get('flow.network')
          setIsCorrectNetwork(network === 'testnet')
          
          // Get FLOW balance
          const provider = new ethers.providers.JsonRpcProvider(FLOW_TESTNET_RPC)
          const balanceWei = await provider.getBalance(user.wallet.address)
          const balanceFlow = ethers.utils.formatEther(balanceWei)
          setBalance(Number(balanceFlow).toFixed(4))
        } catch (error) {
          console.error('Error checking network/balance:', error)
          setBalance('0')
        }
      }
    }

    checkNetworkAndBalance()
  }, [ready, authenticated, user])

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Projects
              </Link>
              <Link
                to="/create-project"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Create Project
              </Link>
              {authenticated && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!ready ? (
              <p>Loading...</p>
            ) : !authenticated ? (
              <LoginWithPrivy />
            ) : (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg border border-gray-300">
                  <WalletIcon className="h-5 w-5 text-gray-500" />
                  <span>{shortenAddress(user?.wallet?.address || '')}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">Connected Wallet</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {shortenAddress(user?.wallet?.address || '')}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">Balance:</p>
                      <p className="text-sm font-medium text-gray-900">{balance} FLOW</p>
                    </div>
                    {!isCorrectNetwork && (
                      <div className="mt-2 flex items-center text-xs text-red-600">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        Please connect to Flow Testnet
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/create-project"
                          className={`${active ? 'bg-gray-100' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <PlusCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Create Project
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`${active ? 'bg-gray-100' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <RectangleStackIcon className="mr-3 h-5 w-5 text-gray-500" />
                          My Projects
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${active ? 'bg-gray-100' : ''} flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserCircleIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500" />
                          Disconnect
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export { Navigation }
