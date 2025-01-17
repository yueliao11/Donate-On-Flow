import { usePrivy } from '@privy-io/react-auth';

export default function LoginWithPrivy() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) return <p>加载中...</p>;

  return (
    <div className="flex items-center justify-center">
      {authenticated ? (
        <div className="text-center">
          {user?.email && (
            <p>
              欢迎, <span>{user?.email?.address}</span>!
            </p>
          )}
          <p>
            已连接钱包: <span>{user?.wallet?.address}</span>
          </p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            断开连接
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1>连接钱包</h1>
          <p>使用 Privy 连接以开始</p>
          <button
            onClick={login}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            连接 Privy 钱包
          </button>
        </div>
      )}
    </div>
  );
} 