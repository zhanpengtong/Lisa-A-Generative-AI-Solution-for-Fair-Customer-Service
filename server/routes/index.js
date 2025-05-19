// index.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Order from '../models/Order.js';
import { getGptResponse } from '../services/openaiService.js';

const router = express.Router();

const CustomerService_CONTEXT = [
  {
    role: 'system',
    content: `
      You are an AI customer service assistant named Lisa.
      Respond in a friendly, helpful, and professional manner.

      If a customer asks about a return:
      - Confirm whether they want to start a new return or check an existing one.
      - Provide clear instructions for initiating a return and mention that processing takes three business days.
      - Ask for tracking details if they have already started the return.

      If a customer expresses dissatisfaction:
      - Apologize and guide them on returning the product.

      If a customer faces difficulties with a product:
      - Offer simple and effective guidance tailored to non-technical users.

      Always end interactions with: "Is there anything else I can help you with today?"
    `,
  },
];

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const fetchUserData = async (userId) => {
  try {
    const user = await User.findById(userId);
    const chats = await Chat.find({ userId });
    const orders = await Order.find({ userId });
    return { user, chats, orders };
  } catch (err) {
    throw new Error(`Failed to fetch user data: ${err.message}`);
  }
};

router.post('/chat/generate', authenticateToken, async (req, res) => {
  const { messages } = req.body;

  try {
    const userId = req.user.userId;

    const userData = await fetchUserData(userId);

    const fullContext = [
      ...CustomerService_CONTEXT,
      { role: 'user', content: `User info: ${JSON.stringify(userData.user)}` },
      { role: 'user', content: `Chat history: ${JSON.stringify(userData.chats)}` },
      { role: 'user', content: `Order history: ${JSON.stringify(userData.orders)}` },
      ...messages,
    ];

    const response = await getGptResponse(fullContext);
    const reply = response.choices[0].message.content;

    const chat = new Chat({
      userId,
      messages: [
        ...messages,
        { role: 'assistant', content: reply },
      ],
    });
    await chat.save();

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error generating chat response:', error.message);
    res.status(500).json({ error: 'Failed to generate chat response', details: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

router.get('/chat', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.userId });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats', details: err.message });
  }
});

router.put('/chat/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { messages } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(id, { messages }, { new: true });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json({ message: 'Chat updated successfully', chat });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chat', details: err.message });
  }
});

router.delete('/chat/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const chat = await Chat.findByIdAndDelete(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chat', details: err.message });
  }
});

router.post('/order', authenticateToken, async (req, res) => {
  const { itemNumber, itemName, shippingAddress, estimatedDeliveryDay, orderStatus } = req.body;
  try {
    const order = new Order({
      userId: req.user.userId,
      itemNumber,
      itemName,
      shippingAddress,
      estimatedDeliveryDay,
      orderStatus,
    });
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

router.get('/order', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

router.put('/order/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { itemNumber, itemName, shippingAddress, estimatedDeliveryDay, orderStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { itemNumber, itemName, shippingAddress, estimatedDeliveryDay, orderStatus },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
});

router.delete('/order/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order', details: err.message });
  }
});

export default router;
