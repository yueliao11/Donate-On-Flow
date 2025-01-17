import { Link } from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, WalletIcon } from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import LoginWithPrivy from './LoginWithPrivy'

const Navigation = () => {
  const { ready, authenticated, user } = usePrivy()
  
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
                  <span>{user?.wallet?.address}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">已连接钱包</p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {user?.wallet?.address}
                    </p>
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          仪表盘
                        </Link>
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
