import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// 创建 Express 中间件插件
function expressMiddleware() {
  const app = express();
  let supabase: any = null;

  app.use(cors());
  app.use(express.json());

  // 错误处理中间件
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });
  
  // 初始化 Supabase 中间件
  const initSupabase = (req: any, res: any, next: any) => {
    if (!supabase) {
      try {
        // 使用 Vite 的环境变量加载方式
        const env = loadEnv('', process.cwd(), '');
        const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log('Current working directory:', process.cwd());
        console.log('Supabase Config:', {
          url: supabaseUrl ? 'Found' : 'Missing',
          key: supabaseAnonKey ? 'Found' : 'Missing',
          env: Object.keys(env)
        });

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }

        supabase = createClient(supabaseUrl, supabaseAnonKey);
      } catch (error: any) {
        console.error('Supabase initialization error:', error);
        return res.status(500).json({ 
          error: 'Failed to initialize Supabase',
          details: error.message 
        });
      }
    }
    next();
  };

  // 项目相关的路由
  app.use(initSupabase);

  app.get('/projects', async (req, res) => {
    try {
      const { category, search, status } = req.query;
      console.log('Query params:', { category, search, status });

      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      console.log('Executing Supabase query...');
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Supabase response:', {
        count: data?.length || 0,
        firstItem: data?.[0],
        fields: data?.[0] ? Object.keys(data[0]) : []
      });

      // 验证数据格式
      const validatedData = (data || []).map(item => {
        // 确保所有必需的字段都存在
        const requiredFields = [
          'id',
          'title',
          'description',
          'target_amount',
          'current_amount',
          'status',
          'creator_address',
          'category',
          'image_url',
          'end_date',
          'created_at',
          'updated_at'
        ];

        const missingFields = requiredFields.filter(field => !(field in item));
        if (missingFields.length > 0) {
          console.warn(`Project ${item.id} missing fields:`, missingFields);
        }

        // 确保数值字段是数字类型
        return {
          ...item,
          target_amount: Number(item.target_amount),
          current_amount: Number(item.current_amount),
          id: Number(item.id)
        };
      });

      res.json(validatedData);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ 
        error: 'Error fetching projects',
        details: error.message 
      });
    }
  });

  app.get('/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          milestones (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      res.status(500).json({ 
        error: 'Error fetching project',
        details: error.message 
      });
    }
  });

  return {
    name: 'configure-server',
    configureServer(server) {
      // 在 Vite 中间件之前添加 API 路由
      server.middlewares.use('/api', (req, res, next) => {
        // 移除 /api 前缀
        req.url = req.url?.replace(/^\/api/, '') || req.url;
        app(req, res, next);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 在配置函数中加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      expressMiddleware(),  // 确保 API 中间件在 React 之前
      react()
    ],
    optimizeDeps: {
      exclude: ['lucide-react', '@backpack/backpack-js'],
    },
    server: {
      port: 5176, // 指定固定端口
      strictPort: true, // 如果端口被占用，不要尝试下一个端口
    },
    define: {
      'process.env': {
        NEXT_PUBLIC_PRIVY_APP_ID: JSON.stringify(process.env.NEXT_PUBLIC_PRIVY_APP_ID)
      }
    },
    build: {
      rollupOptions: {
        external: ['@backpack/backpack-js']
      }
    }
  };
});
