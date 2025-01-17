// 添加环境变量检查和默认值
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID not found, using default value');
  // 可以提供一个默认值或者适当的错误处理
} 