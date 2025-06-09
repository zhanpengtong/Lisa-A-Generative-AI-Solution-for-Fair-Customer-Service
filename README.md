# 💬 Lisa – A Generative AI Solution for Fair Customer Service

**Lisa** is a full-stack generative AI system developed end-to-end by **Zhanpeng Tong** to demonstrate how human-centered design and LLM-powered reasoning can improve fairness, personalization, and efficiency in customer service.

---

## 🛠 Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React + TypeScript + Vite                          |
| Backend    | Node.js + Express + JWT                            |
| AI Service | OpenAI GPT API (parameterized prompt calls)        |
| Dev Tools  | REST API, Axios, .env config, Git, Vite, Postman   |
| Database   | MongoDB (user context + session tracking)          |

---

## ✨ Key Features

- 📱 **Clean UI** with session-based chat window and order dashboard  
- 💬 **Multi-turn dialogue support** with full chat history passed in prompts  
- ⚙️ **Role-based, few-shot prompt engineering** for personalized assistant behavior  
- 📡 **Secure REST API** backend with JWT-authenticated user context  
- 🧠 **Dynamic memory chaining**, token length control, and temperature tuning  
- 🛑 **Feedback reporting system** to flag unsatisfactory replies (with chat transcript)  
- 🪄 **Human-Centered AI elements**: transparency labels, ethical guardrails, explainability UX  

---

## 📁 Project Structure

```
Lisa-AI/
├── frontend/                     # Vite-based React frontend
│   ├── src/
│   │   ├── ChatRoom.tsx         # Core dialogue logic + context memory
│   │   ├── ManageOrder.tsx      # Order management UI
│   │   ├── useText.ts           # Prompt utilities
│   └── vite.config.ts
│
├── server/                      # Express backend
│   ├── routes/                  # Chat + order APIs
│   ├── services/                # LLM API logic
│   ├── models/                  # MongoDB schemas
│   └── .env                     # API keys, config
```

---

## ▶️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/zhanpengtong/Lisa-A-Generative-AI-Solution-for-Fair-Customer-Service.git
cd Lisa-AI
```

### 2. Start the backend
```bash
cd server
npm install
node server.js
```

### 3. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

> 💡 Make sure to configure your `.env` file with a valid OpenAI API key and MongoDB URI

---

## 🔍 How It Works

When a user sends a message:

1. **Frontend ChatRoom** component captures input and appends it to the current `messages[]` history.
2. The entire message history is sent to the **backend** via a POST request.
3. The **backend service layer** formats the prompt and sends it to **OpenAI GPT** with parameters like temperature and max tokens.
4. The response is returned and rendered on screen, with updated `messages[]` and optional feedback flagging.
5. All flagged sessions are stored for audit and future model improvement.

---

## 🧑‍💻 Developer Notes

This project was designed and built from scratch by **Zhanpeng Tong** to demonstrate practical skills in:
- Full-stack LLM application development
- Prompt engineering and AI integration
- Ethical UX and human-AI interaction design
- JWT authentication and context-aware communication
- React state management and RESTful API architecture

---

## 📄 License

MIT – Educational use and portfolio demonstration only.
