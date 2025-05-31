
# 💬 Lisa – A Generative AI Solution for Fair Customer Service

**Lisa** is an end-to-end full-stack project designed and developed individually by Zhanpeng Tong to explore human-centered, generative AI applications for customer service. Lisa empowers fair, consistent, and helpful communication between companies and customers using LLM APIs behind a clean UI interface.

---

## 🛠 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React + TypeScript + Vite     |
| Backend    | Node.js + Express             |
| AI Service | LLM API (e.g., OpenAI/GPT-based endpoint) |
| Dev Tools  | Vite, npm, Git, REST API, .env configuration |

---

## ✨ Features

- Clean UI for customer service interaction
- Prompt input field for user-generated complaints/questions
- Dynamic, consistent, LLM-generated replies
- Frontend-backend API integration
- Modular backend code with service-routing-model structure

---

## 📁 Project Structure

```
Lisa-AI/
├── frontend/                     # React TypeScript frontend
│   ├── index.html
│   ├── src/
│   └── vite.config.ts
│
├── server/                       # Express.js backend
│   ├── server.js
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── .env                      # Contains LLM API keys
```

---

## ▶️ How to Run

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Lisa-AI.git
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

> 💡 Make sure to add your LLM API key to `server/.env`

---

## 🧑‍💻 Developer Notes

This project was fully designed and implemented by **Zhanpeng Tong** as part of a capstone for exploring human-centered generative AI interfaces.

- Frontend: Vite + React + TS from scratch
- Backend: Built with Express.js and modular route/controller logic
- AI Service: Integrated LLM API with parameterized prompt handling
- Focus: Transparency, fairness, and usability in automated responses

---

## 📄 License

MIT – for educational, demo, and portfolio use only.
