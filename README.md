# 🎬 Netflix – A Netflix Clone (Full-Stack)

This is a full-stack web application that mimics Netflix’s user interface and streaming layout using modern tools like **React 18**, **Tailwind CSS**, and **Express**. It supports authentication, persistent sessions, dynamic movie carousels, and embedded video players.

---

## 🚀 Features

- 🔐 **User Authentication** (via Passport.js & Express sessions)
- 🎥 **Embedded Video Streaming** using `react-player`
- 📁 Modular, Scalable Codebase with Vite
- 💅 Fully Responsive UI with **Tailwind CSS**
- ⚙️ Backend with **Express**, **PostgreSQL**, and **Drizzle ORM**
- 🧠 Form validation with **Zod** and **React Hook Form**
- 💾 Persistent Session Storage with `connect-pg-simple`
- 📊 Dashboard and data visualization using **Recharts**

---

## 🛠 Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Vite
- React Player
- Lucide Icons
- Radix UI
- React Hook Form

### Backend
- Express
- PostgreSQL
- Drizzle ORM
- Passport + express-session
- TypeScript

---

## 📦 Installation

### 1. Clone the repository

```bash
1. git clone https://github.com/raaj-rahul/NetflixClone.git
cd NetflixClone
2. Install dependencies
bash
Copy
Edit
npm install
3. Set up environment variables
Create a .env file in the root directory:

env
Copy
Edit
DATABASE_URL=postgresql://username:password@localhost:5432/NetflixClone
SESSION_SECRET=your_secret
4. Run migrations and seed (if any)
bash
Copy
Edit
npm run db:push
5. Start development server
bash
Copy
Edit
npm run dev
📁 Folder Structure
arduino
Copy
Edit
Netflix Clone/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── styles/
│   └── ...
├── server/
│   ├── index.ts
│   ├── auth/
│   └── db/
├── drizzle.config.ts
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json

```
###📸 Screenshots

![image](https://github.com/user-attachments/assets/f6d396ae-e4e2-4071-b28b-724f2101e655)
![image](https://github.com/user-attachments/assets/d3e7fe1b-b041-4057-94f7-c4df3b7bbbb5)



