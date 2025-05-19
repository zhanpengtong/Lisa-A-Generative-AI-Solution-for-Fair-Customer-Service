import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // 检查响应是否成功
    if (response.ok) {
      const data = await response.json(); // 调用一次 response.json()

      // 存储 Token 和 Username
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // 假设后端返回了 username

      // 跳转到主页或其他页面
      navigate('/');
    } else {
      // 处理登录失败的情况
      const errorData = await response.json(); // 获取错误信息
      alert(errorData.error || 'Invalid username or password');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('An error occurred. Please try again later.');
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back To Target's AI Customer Service</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button
          onClick={() => navigate('/register')}
          className="create-account-button"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
