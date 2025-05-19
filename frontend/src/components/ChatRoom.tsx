import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 用于导航到登录页
import '../styles/ChatRoom.css';

const ChatRoom = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate(); // 导航实例


const handleSend = async (predefinedMessage?: string) => {
  const messageContent = predefinedMessage || input;
  if (!messageContent.trim()) return;

  const userMessage = { role: 'user', content: messageContent };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const response = await fetch('http://localhost:5001/chat/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ messages: [...messages.map((msg) => ({ role: msg.role, content: msg.content })), userMessage] }),
    });

    const data = await response.json();

    if (response.ok && data.reply) {
      const aiMessage = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      console.error('Error:', data.error);
    }
  } catch (err) {
    console.error('Error communicating with backend:', err);
  }

  if (!predefinedMessage) {
    setInput('');
  }
};

const handleReportIssues = () => {
  const username = localStorage.getItem('username') || 'Unknown User'; // 获取存储的用户名

  const email = 'support@example.com'; // 替换为目标邮箱
  const subject = encodeURIComponent('Issue Report'); // 邮件主题
  const body = encodeURIComponent(
    `Dear Support Team,\n\nI am experiencing an issue while using the AI Customer Service application.\n\nMy username: ${username}\n\nCould you please check the chat records associated with my account and help resolve the issue?\n\nThank you!\n\nBest regards,\n${username}`
  ); // 邮件正文

  // 使用 `mailto:` 链接打开邮件客户端
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};





  const handleLogout = () => {
    // 清除本地存储中的 Token
    localStorage.removeItem('token');

    // 重定向到登录页
    navigate('/login');
  };

  return (
      <div className="chatroom-container">
        <div className="chatroom-header">
          <h1 className="chatroom-title">Welcome Back To Target's AI Customer Service</h1>
          <button className="chatroom-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="chatroom-buttons">
          <button
              className="chatroom-button"
              onClick={() => handleSend('Check your order status')}
          >
            Check your order status
          </button>
          <button
              className="chatroom-button"
              onClick={() => handleSend('Track your refund')}
          >
            Track your refund
          </button>
          <button
              className="chatroom-button"
              onClick={() => handleSend('Assist you in finding a product')}
          >
            Assist you in finding a product
          </button>
          <button className="chatroom-button" onClick={handleReportIssues}>
            Report Issues
          </button>

        </div>
        <div className="chatroom-messages">
          {messages.map((msg, idx) => (
              <div
                  key={idx}
                  className={`chatroom-message ${msg.role === 'user' ? 'user' : 'ai'}`}
              >
                {msg.content}
              </div>
          ))}
        </div>

        <div className="chatroom-input-container">
          <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="chatroom-input"
          />
          <button onClick={() => handleSend()} className="chatroom-send">
            Send
          </button>
        </div>
      </div>
  );
};

export default ChatRoom;
