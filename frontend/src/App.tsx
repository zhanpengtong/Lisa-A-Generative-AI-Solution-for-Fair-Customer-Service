import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./components/Loginpage";
import RegisterPage from './components/RegisterPage';
import ChatRoom from './components/ChatRoom';
import ManageOrder from "./components/ManageOrder";

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // 检查是否有 token

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={isAuthenticated ? <ChatRoom /> : <Navigate to="/login" />}
      />
        <Route path="/m" element={<ManageOrder />} />
    </Routes>
  );
};

export default App;
