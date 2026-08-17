# InterviewIQ 🎯

InterviewIQ is a full-stack, AI-powered mock interview platform. Users set up a topic/role, go through a timed AI-driven interview, and receive a detailed scored report — with history tracking and paid plans built in.

**🔗 Live Demo:** [https://interview-iq-henna-mu.vercel.app/](https://interview-iq-henna-mu.vercel.app/)

**📦 Repository:** [https://github.com/Vanshrekhi/InterviewAgent](https://github.com/Vanshrekhi/InterviewAgent)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Interview Flow](#interview-flow)
- [Authentication Flow](#authentication-flow)
- [Data Model](#data-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)
- [Author](#author)

---

## Features

- 🔐 **Authentication** — JWT + cookie-based sessions
- 🎤 **AI mock interviews** — 3-step flow (Setup → Live Interview → Report), powered by an AI model via OpenRouter
- ⏱️ **Timed sessions** — built-in `Timer` component keeps interviews realistic
- 📊 **Scored reports** — visual breakdowns using Recharts, downloadable as PDF (jsPDF + AutoTable)
- 🕘 **Interview history** — every past session is saved and browsable
- 💳 **Payments** — Razorpay-powered pricing/subscription plans
- ⚡ **Modern UI** — React 19, Redux Toolkit, Tailwind CSS, Framer Motion animations

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router DOM, Tailwind CSS, Axios, Firebase, Recharts, jsPDF/jsPDF-AutoTable, Framer Motion |
| **Backend** | Node.js, Express 5, MongoDB + Mongoose, JWT, cookie-parser, Multer, CORS, dotenv |
| **AI / Integrations** | OpenRouter (AI interview question generation & evaluation), Razorpay (payments), pdfjs-dist (PDF parsing, e.g. resume uploads) |
| **Deployment** | Vercel (frontend) |

---

## System Architecture

```mermaid
flowchart TB
    subgraph Client["Client (React + Vite, deployed on Vercel)"]
        UI[React UI]
        Redux[Redux Toolkit Store]
        Pages["Pages: Auth, Home, InterviewPage,\nInterviewHistory, InterviewReport, Pricing"]
        UI --> Redux
        UI --> Pages
    end

    subgraph Server["Server (Node.js + Express)"]
        Routes["Routes\nauth / user / interview / payment"]
        Middlewares["Middlewares\nisAuth, multer"]
        Controllers["Controllers\nauth, user, interview, payment"]
        Services["Services\nopenRouter.service, razorpay.service"]
        Routes --> Middlewares --> Controllers --> Services
    end

    subgraph External["External Services"]
        Mongo[(MongoDB)]
        OpenRouter[[OpenRouter AI API]]
        RazorpayAPI[[Razorpay API]]
        FirebaseAPI[[Firebase]]
    end

    Client -- REST / Axios with JWT cookie --> Server
    Controllers --> Mongo
    Services --> OpenRouter
    Services --> RazorpayAPI
    Client --> FirebaseAPI
```

---

## Interview Flow

The core product experience — taking a mock interview — moves through three steps on the frontend, backed by AI-generated questions and scoring on the backend.

```mermaid
sequenceDiagram
    actor User
    participant FE as Client (React)
    participant API as Express API
    participant AI as OpenRouter Service
    participant DB as MongoDB

    User->>FE: Step 1 - Set up interview (role, topic, difficulty)
    FE->>API: POST /interview (create session)
    API->>AI: Request interview questions
    AI-->>API: Generated questions
    API->>DB: Save interview session
    API-->>FE: Return questions + session id

    User->>FE: Step 2 - Answer questions (Timer running)
    FE->>API: POST /interview/:id/answers
    API->>AI: Evaluate answers
    AI-->>API: Feedback + scores
    API->>DB: Update interview with results

    User->>FE: Step 3 - View report
    FE->>API: GET /interview/:id
    API->>DB: Fetch interview + scores
    API-->>FE: Report data
    FE-->>User: Charts (Recharts) + PDF export (jsPDF)
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Client (React)
    participant API as Express API
    participant MW as isAuth Middleware
    participant DB as MongoDB

    User->>FE: Sign up / Log in (Auth page)
    FE->>API: POST /auth/signup or /auth/login
    API->>DB: Create / verify user
    API-->>FE: Set JWT in HTTP-only cookie

    User->>FE: Navigate to protected page (e.g. InterviewHistory)
    FE->>API: GET /interview/history (cookie sent automatically)
    API->>MW: Verify JWT
    alt Valid token
        MW-->>API: User authenticated
        API->>DB: Fetch user's interview history
        API-->>FE: 200 OK + data
    else Invalid/missing token
        MW-->>FE: 401 Unauthorized
        FE-->>User: Redirect to login
    end
```

---

## Data Model

```mermaid
erDiagram
    USER ||--o{ INTERVIEW : takes
    USER ||--o{ PAYMENT : makes

    USER {
        ObjectId _id
        string name
        string email
        string password
        string plan
        date createdAt
    }

    INTERVIEW {
        ObjectId _id
        ObjectId userId
        string role
        string topic
        string difficulty
        array questions
        array answers
        number score
        date createdAt
    }

    PAYMENT {
        ObjectId _id
        ObjectId userId
        string razorpayOrderId
        string razorpayPaymentId
        number amount
        string status
        date createdAt
    }
```

---

## Project Structure

```
InterviewIQ/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Step1SetUp.jsx
│   │   │   ├── Step2Interview.jsx
│   │   │   ├── Step3Report.jsx
│   │   │   └── Timer.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InterviewPage.jsx
│   │   │   ├── InterviewHistory.jsx
│   │   │   ├── InterviewReport.jsx
│   │   │   └── Pricing.jsx
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                        # Express backend
    ├── config/
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── interview.controller.js
    │   ├── payment.controller.js
    │   └── user.controller.js
    ├── middlewares/
    │   ├── isAuth.js
    │   └── multer.js
    ├── models/
    │   ├── interview.model.js
    │   ├── payment.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── auth.route.js
    │   ├── interview.route.js
    │   ├── payment.route.js
    │   └── user.route.js
    ├── services/
    │   ├── openRouter.service.js
    │   └── razorpay.service.js
    ├── index.js
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB instance (local or MongoDB Atlas)
- API keys for OpenRouter, Razorpay, and Firebase (see below)

### 1. Clone the repository
```bash
git clone https://github.com/Vanshrekhi/InterviewAgent
cd InterviewIQ
```

### 2. Set up the backend
```bash
cd server
npm install
cp .env.example .env   # create this file if it doesn't exist yet — see Environment Variables below
npm run dev
```
The server uses `nodemon` and starts from `index.js`.

### 3. Set up the frontend
```bash
cd ../client
npm install
npm run dev
```
The client runs on Vite's dev server (typically `http://localhost:5173`) and talks to the backend API.

### 4. Build for production
```bash
cd client
npm run build
```

---

## Environment Variables

Create a `.env` file inside `/server` with values similar to:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

If the client uses Firebase (e.g. for auth or storage), add the relevant Firebase config to a `.env` file inside `/client` as well (prefixed with `VITE_`, per Vite convention).

> ⚠️ Never commit real `.env` files. Add them to `.gitignore` (already present in `/server`).

---

## Deployment

The frontend is deployed on **Vercel**:
👉 [https://interview-iq-henna-mu.vercel.app/](https://interview-iq-henna-mu.vercel.app/)

The backend (Express + MongoDB) needs to be deployed separately (e.g. Render, Railway, or a VPS) with the environment variables above configured, and `CLIENT_URL`/CORS updated to match the deployed frontend URL.

---

## License

No license specified yet. Consider adding one (e.g. MIT) if you plan to open this project up for contributions.

## Author

**Vansh Rekhi** - [vanshrekhi05@gmail.com]
