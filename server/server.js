import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // 正确地导入路由

dotenv.config();

const app = express();

// 启用 CORS 支持
app.use(cors({
  origin: 'http://localhost:5173', // 允许来自前端的请求
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 限制允许的方法
  credentials: true // 如果需要发送 Cookie 或者认证信息，启用此选项
}));

// 中间件解析 JSON 请求体
app.use(express.json());

// 使用路由
app.use(routes);

// 连接到 MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
