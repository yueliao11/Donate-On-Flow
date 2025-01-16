# 项目数据来源分析

## 1. 智能合约数据

项目的核心数据来自于Flow区块链上的智能合约`CharityProject`。主要包含以下数据结构：

### 1.1 项目数据结构
- title: 项目标题
- description: 项目描述
- targetAmount: 目标金额
- currentAmount: 当前筹集金额
- owner: 项目所有者地址
- isActive: 项目是否激活
- minimumFee: 最小费用
- isMinimumFeePaid: 是否支付最小费用

### 1.2 合约事件
合约会触发以下事件用于前端数据更新：
- DonationReceived: 接收到捐款时触发
- MinimumFeePaid: 支付最小费用时触发
- ProjectCreated: 创建新项目时触发

## 2. 前端展示

### 2.1 项目列表展示
- ProjectGrid组件负责展示项目网格
- 通过ProjectCard组件展示每个项目的具体信息
- 包含加载状态(LoadingSpinner)和错误处理(ErrorMessage)

### 2.2 项目卡片信息
ProjectCard组件展示以下信息：
- 项目封面图片
- 项目标题
- 项目描述
- 筹款进度条
- 当前筹集金额
- 目标金额
- 剩余时间

### 2.3 数据更新机制
1. 初始加载：从区块链获取项目列表
2. 实时更新：监听合约事件
   - 捐款事件：更新筹集金额
   - 新项目事件：添加新项目
   - 最小费用支付：更新项目状态

## 3. 数据流程

1. 智能合约存储核心数据
2. 前端通过Web3接口读取合约数据
3. 使用React组件将数据渲染为用户界面
4. 通过事件监听实现数据实时更新

## 4. 总结

该项目采用了典型的Web3应用架构：
- 使用智能合约作为数据存储和业务逻辑层
- 前端通过Web3接口与合约交互
- React组件负责数据展示和用户交互
- 事件系统实现实时数据更新

## 5. 模拟数据实现

### 5.1 模拟数据结构
项目在开发阶段使用模拟数据进行展示，主要包含以下数据：

- 项目基本信息：
  - id: 项目唯一标识
  - title: 项目标题
  - description: 项目描述
  - coverImage: 项目封面图片URL
  - currentAmount: 当前筹集金额
  - targetAmount: 目标金额
  - endTime: 结束时间
  - category: 项目类别
  - creator: 创建者地址
  - status: 项目状态

### 5.2 模拟数据API
在 `services/api/projects.ts` 中实现了以下模拟API：

1. `fetchProjects`: 获取项目列表
   - 支持搜索过滤
   - 支持类别筛选
   - 支持排序（最新、最热门、即将结束）

2. `createProject`: 创建新项目

3. `donateToProject`: 项目捐款

### 5.3 模拟图片资源
项目使用Unsplash提供的图片作为模拟项目封面：
- 教育类项目：使用学校相关图片
- 医疗类项目：使用医疗相关图片

### 5.4 数据过滤和排序
模拟数据支持多种过滤和排序方式：

1. 搜索过滤：
   - 标题匹配
   - 描述匹配
   - 不区分大小写

2. 类别过滤：
   - 按项目类别筛选

3. 排序方式：
   - 最新项目
   - 最受欢迎（按筹款金额）
   - 即将结束

## 6. Supabase数据实现

### 6.1 数据模型设计
Supabase中定义了以下主要数据表：

1. projects表：
   - id: 项目ID
   - title: 项目标题
   - description: 项目描述
   - target_amount: 目标金额
   - current_amount: 当前金额
   - status: 项目状态
   - creator_address: 创建者地址
   - category: 项目类别
   - image_url: 项目图片
   - end_date: 结束日期
   - chain_project_id: 链上项目ID
   - minimum_fee_paid: 是否支付最小费用

2. milestones表：
   - id: 里程碑ID
   - project_id: 关联项目ID
   - title: 里程碑标题
   - description: 描述
   - percentage: 占比
   - required_amount: 所需金额
   - current_amount: 当前金额
   - status: 状态

3. donations表：
   - id: 捐赠ID
   - project_id: 项目ID
   - donor_address: 捐赠者地址
   - amount: 捐赠金额
   - transaction_id: 交易ID

### 6.2 API实现
在 `src/lib/supabase.ts` 中实现了完整的数据操作API：

1. 项目相关：
   - getProjects: 获取项目列表（支持搜索、分类、状态过滤）
   - getProjectById: 获取单个项目详情
   - createProject: 创建新项目
   - updateProjectStatus: 更新项目状态
   - updateProjectAmount: 更新项目金额

2. 里程碑相关：
   - getProjectMilestones: 获取项目里程碑
   - createMilestone: 创建里程碑
   - updateMilestoneStatus: 更新里程碑状态
   - updateMilestoneAmount: 更新里程碑金额

3. 捐赠相关：
   - getProjectDonations: 获取项目捐赠记录
   - createDonation: 创建捐赠记录
   - getDonationsByDonor: 获取捐赠者的捐赠历史

### 6.3 从模拟数据迁移到Supabase

要启用Supabase数据展示，需要进行以下最小改动：

1. 环境配置：
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 修改数据服务：
```typescript
// src/services/api/projects.ts
import { getProjects, createProject, donateToProject } from '../../lib/supabase';

// 替换模拟数据函数
export const fetchProjects = async (
  search?: string,
  category?: string,
  sort?: 'latest' | 'popular' | 'ending'
) => {
  const projects = await getProjects({
    search,
    category: category as Category,
    status: 'ACTIVE'
  });
  
  // 保持原有的排序逻辑
  if (sort === 'popular') {
    return projects.sort((a, b) => b.current_amount - a.current_amount);
  } else if (sort === 'ending') {
    return projects.sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
  }
  return projects;
};

// 其他函数类似替换
```

3. 类型适配：
```typescript
// src/types/project.ts
import { Project as SupabaseProject } from '../lib/supabase';

// 适配现有类型到Supabase类型
export interface Project {
  id: string;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  endTime: Date;
  category: string;
  creator: string;
  status: string;
  coverImage: string;
}

// 转换函数
export function adaptSupabaseProject(project: SupabaseProject): Project {
  return {
    id: project.id.toString(),
    title: project.title,
    description: project.description,
    currentAmount: project.current_amount,
    targetAmount: project.target_amount,
    endTime: new Date(project.end_date),
    category: project.category,
    creator: project.creator_address,
    status: project.status.toLowerCase(),
    coverImage: project.image_url
  };
}
```

4. 组件调整：
- 确保所有使用项目数据的组件都使用适配后的类型
- 更新数据加载逻辑以处理异步请求
- 添加适当的加载状态和错误处理

这种方案的优点是：
- 最小化代码改动
- 保持现有功能和UI不变
- 平滑过渡到实际数据库
- 便于后续功能扩展

## 7. Vite配置中的Supabase实现

### 7.1 Supabase中间件配置
在 `vite.config.ts` 中实现了一个Express中间件来处理Supabase的连接和数据请求：

1. Supabase初始化：
```typescript
const initSupabase = (req: any, res: any, next: any) => {
  if (!supabase) {
    const env = loadEnv('', process.cwd(), '');
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  next();
};
```

2. API路由实现：
```typescript
app.get('/projects', async (req, res) => {
  const { category, search, status } = req.query;
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
    
  // 应用过滤条件
  if (category) query = query.eq('category', category);
  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('title', `%${search}%`);
  
  const { data, error } = await query;
  // ... 处理响应
});
```

### 7.2 环境变量配置
项目使用以下环境变量来配置Supabase：

1. 必需的环境变量：
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. 本地开发环境变量：
```bash
LOCAL_SUPABASE_URL=local_supabase_url
LOCAL_SUPABASE_ANON_KEY=local_supabase_anon_key
```

### 7.3 开启Supabase数据获取

要启用从Supabase获取演示数据，需要：

1. 确保环境变量配置正确：
   - 在 `.env.local` 文件中设置正确的Supabase URL和密钥
   - 确保变量名前缀与代码中使用的一致（NEXT_PUBLIC_ 或 VITE_）

2. 启用Supabase中间件：
   - vite.config.ts中的expressMiddleware已经配置好了Supabase中间件
   - 确保 `app.use(initSupabase)` 被正确调用

3. 数据服务配置：
   - 在 `src/lib/supabase.ts` 中使用相同的环境变量
   - 确保createClient使用正确的配置

4. 切换数据源：
```typescript
// src/services/api/projects.ts
const USE_SUPABASE = process.env.VITE_USE_SUPABASE === 'true';

export const fetchProjects = async (...args) => {
  if (USE_SUPABASE) {
    return await getProjectsFromSupabase(...args);
  }
  return getMockProjects(...args);
};
```

5. 验证数据连接：
   - 检查Supabase控制台中的数据表是否正确创建
   - 使用Supabase提供的API测试工具验证连接
   - 检查vite.config.ts中的日志输出确认配置加载正确

### 7.4 数据流程
使用vite.config.ts中的Supabase配置时，数据流程如下：

1. 前端请求 -> Vite开发服务器
2. Express中间件拦截请求
3. Supabase中间件初始化连接
4. 执行数据库查询
5. 返回处理后的响应

这种配置允许在开发环境中模拟生产环境的API请求，同时保持了代码的一致性。

## 8. OKX钱包集成对比分析

### 8.1 当前实现对比

#### Example项目实现
1. 使用 OKXUniversalConnectUI
```typescript
const uiClient = await OKXUniversalConnectUI.init({
  dappMetaData: {
    name: 'Flow DApp',
    icon: 'https://cryptologos.cc/logos/flow-flow-logo.png',
  },
  actionsConfiguration: {
    returnStrategy: 'none',
    modals: 'all',
  },
  uiPreferences: {
    theme: THEME.LIGHT,
  },
});
```

2. 支持多链配置
```typescript
const session = await client.openModal({
  namespaces: {
    eip155: {
      chains: ['eip155:747'],
      defaultChain: '747',
    },
  },
});
```

3. 完整的状态管理
```typescript
const [client, setClient] = useState<OKXUniversalConnectUI | null>(null);
const [walletAddress, setWalletAddress] = useState<string | null>(null);
const [chainId, setChainId] = useState<string | null>(null);
const [connected, setConnected] = useState(false);
```

#### 本项目实现
1. 使用Flow Client Library (FCL)
```typescript
export const connectWallet = () => fcl.authenticate();
export const disconnectWallet = () => fcl.unauthenticate();
export const getCurrentUser = () => fcl.currentUser().snapshot();
```

2. 简单的事件订阅
```typescript
export const subscribeToAuthChanges = (callback: (user: any) => void) => {
  return fcl.currentUser().subscribe(callback);
};
```

### 8.2 改进建议

为了支持更完善的Telegram登录和OKX钱包集成，建议进行以下最小改动：

1. 创建统一的钱包连接上下文：
```typescript
// src/contexts/WalletContext.tsx
import { OKXUniversalConnectUI } from '@okxconnect/ui';
import * as fcl from '@onflow/fcl';

interface WalletContextType {
  connected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  connectWallet: (type: 'okx' | 'fcl') => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isTelegramUser: boolean;
}

export const WalletContext = createContext<WalletContextType>();

export const WalletProvider: React.FC = ({ children }) => {
  const [okxClient, setOkxClient] = useState<OKXUniversalConnectUI | null>(null);
  const [walletType, setWalletType] = useState<'okx' | 'fcl' | null>(null);
  
  // 初始化OKX客户端
  useEffect(() => {
    initOKXClient();
  }, []);

  // 连接钱包
  const connectWallet = async (type: 'okx' | 'fcl') => {
    setWalletType(type);
    if (type === 'okx') {
      await connectOKX();
    } else {
      await connectFCL();
    }
  };

  return (
    <WalletContext.Provider value={{...}}>
      {children}
    </WalletContext.Provider>
  );
};
```

2. 添加OKX配置：
```typescript
// src/config/okx.ts
export const OKX_CONFIG = {
  dappMetaData: {
    name: 'Donate On Flow',
    icon: '/logo.png',
  },
  actionsConfiguration: {
    returnStrategy: 'tg://resolve',
    modals: 'all',
  },
  chains: {
    flow: {
      chainId: '747',
      rpcUrl: process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE,
    },
  },
};
```

3. 修改登录组件：
```typescript
// src/components/auth/LoginButton.tsx
import { useWallet } from '@/contexts/WalletContext';

export const LoginButton = () => {
  const { connectWallet, isTelegramUser } = useWallet();
  
  const handleLogin = async () => {
    // 如果是Telegram用户，优先使用OKX钱包
    const walletType = isTelegramUser ? 'okx' : 'fcl';
    await connectWallet(walletType);
  };

  return (
    <button onClick={handleLogin}>
      Connect Wallet
    </button>
  );
};
```

4. 环境变量配置：
```bash
# .env.local
NEXT_PUBLIC_OKX_APP_ID=your_okx_app_id
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
```

### 8.3 改进优势

1. 用户体验优化：
   - Telegram用户自动使用OKX钱包
   - 非Telegram用户保持FCL钱包选择
   - 统一的钱包状态管理

2. 功能增强：
   - 支持多链配置
   - 更完善的错误处理
   - 更好的Telegram集成

3. 代码质量：
   - 类型安全
   - 更好的代码组织
   - 更容易维护和扩展

4. 最小改动：
   - 保持现有FCL功能
   - 只添加必要的OKX集成
   - 不影响现有用户

### 8.4 实施步骤

1. 安装依赖：
```bash
npm install @okxconnect/ui
```

2. 添加新文件：
   - src/contexts/WalletContext.tsx
   - src/config/okx.ts

3. 修改现有文件：
   - src/components/auth/LoginButton.tsx
   - src/services/flow/auth.ts（添加OKX支持）

4. 更新环境变量

5. 测试：
   - Telegram环境下的OKX钱包连接
   - 普通环境下的FCL钱包连接
   - 钱包切换和状态管理
