# LMS - Learning Management System

Udemy-like learning platform with courses, video progress tracking, and an AI chatbot.

---

## Steps to run

Do these in order. Use **two terminals** (one for backend, one for frontend).

### 1. Start your database (Aiven MySQL)

- Go to [console.aiven.io](https://console.aiven.io) and sign in.
- Open your **MySQL** service.
- If it is **Paused**, click **Start** and wait until it shows **Running**.

### 2. Backend — first-time setup

**Option A — Use SQLite (no Aiven needed, works offline)**

In the first terminal:

```bash
cd backend
npm install
npm run db:use-sqlite
```

This creates a local database (`prisma/dev.db`), seeds it, and switches your `.env` to use it. Skip to step 3.

**Option B — Use Aiven MySQL**

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

- `db:push` creates the tables in MySQL. If you see *"Can't reach database server"*, use **Option A** (SQLite) instead, or start the MySQL service in Aiven (step 1) and run `npm run db:push` again.
- `db:seed` creates a demo user and sample course.

### 3. Backend — start the server

In the **same** terminal (or a new one):

```bash
cd backend
npm run dev
```

Leave this running. You should see: **LMS Backend running on port 5000**.

### 4. Frontend — install and run

In a **second** terminal:

```bash
cd frontend
npm install --ignore-scripts
npm run dev
```

Leave this running. You should see: **Local: http://localhost:3000**.

### 5. Open the app

- In your browser go to: **http://localhost:3000**
- **Sign up** with any email/password, or **Log in** with:
  - Email: `demo@lms.com`
  - Password: `demo123`

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express
- **Database:** MySQL (Aiven)
- **ORM:** Prisma
- **Auth:** JWT (access token + HTTP-only refresh cookie)
- **Video:** YouTube (react-youtube)
- **Chatbot:** Hugging Face Inference API

## Project Structure

```
lms/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed demo user + sample course
│   ├── src/
│   │   ├── config/          # DB (Prisma client)
│   │   ├── middleware/      # JWT auth
│   │   ├── routes/          # auth, subjects, videos, progress, chat
│   │   ├── controllers/
│   │   ├── utils/           # JWT helpers
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # VideoPlayer, Sidebar, Chatbot, etc.
│   │   ├── contexts/        # AuthContext
│   │   ├── lib/             # api (axios), auth
│   │   └── types/
│   ├── .env.local.example
│   └── package.json
└── README.md
```

## API Keys & Environment

You need:

1. **Aiven MySQL** – Create a MySQL service on [Aiven](https://aiven.io), then copy the connection string.
2. **Hugging Face** – Create an access token at [Hugging Face Settings → Access Tokens](https://huggingface.co/settings/tokens) (required for the chatbot).

### Backend `.env`

Copy `backend/.env.example` to `backend/.env` and set:

- `DATABASE_URL` – Aiven MySQL connection string (e.g. `mysql://user:pass@host:port/defaultdb?sslmode=require`)
- `JWT_ACCESS_SECRET` – Long random string (min 32 chars)
- `JWT_REFRESH_SECRET` – Long random string (min 32 chars)
- `FRONTEND_URL` – Frontend origin (e.g. `http://localhost:3000`)
- `HUGGINGFACE_API_KEY` – Your Hugging Face token (e.g. `hf_xxxxxxxx`)

### Frontend `.env.local`

Copy `frontend/.env.local.example` to `frontend/.env.local` and set:

- `NEXT_PUBLIC_API_URL` – Backend URL (e.g. `http://localhost:5000`)

## Quick start (ready to use)

Backend `.env` and frontend `.env.local` are already configured with your database URL and API key.

**1. Backend (first time)** — install, create tables, seed data:

```bash
cd backend
npm install
npm run setup
```

If `npm run setup` fails with **"Can't reach database server"**: open your [Aiven console](https://console.aiven.io), ensure the MySQL service is **started** (not paused), then run `npm run setup` again from the `backend` folder.

**2. Start backend:**

```bash
cd backend
npm run dev
```

Backend runs at **http://localhost:5000**.

**3. Frontend (new terminal):**

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

**4. Log in:**  
**Email:** `demo@lms.com` · **Password:** `demo123`

---

## Run Locally (detailed)

### Backend

```bash
cd backend
npm install
# .env is already set; or copy .env.example and fill in
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
# .env.local is already set with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Open `http://localhost:3000`.

### Demo login

After seeding: **Email:** `demo@lms.com` **Password:** `demo123`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | Cookie | New access token |
| POST | `/api/auth/logout` | No | Clear refresh cookie |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/subjects` | No | List subjects |
| GET | `/api/subjects/:id` | No | Subject with sections/videos |
| GET | `/api/videos/:id` | No | Single video |
| POST | `/api/progress` | Yes | Save progress (videoId, lastPosition, isCompleted) |
| GET | `/api/progress` | Yes | All progress (for sidebar) |
| GET | `/api/progress/:videoId` | Yes | Progress for one video |
| POST | `/api/chat` | Yes | Chat (message, conversationHistory) |

## Video Progress Logic

- On play: frontend starts a 5-second interval and sends `POST /progress` with `lastPosition`.
- On load: frontend calls `GET /progress/:videoId` and resumes from `lastPosition`.
- On completion (video end or ~95% watched): frontend sends `isCompleted: true`; next video unlocks in sidebar.

## Deployment

- **Backend:** Deploy to [Render](https://render.com) (Web Service). Set env vars; use Render’s MySQL or keep Aiven and set `DATABASE_URL` and `FRONTEND_URL` to your Vercel URL.
- **Frontend:** Deploy to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_API_URL` to your Render backend URL.
- **Database:** Use Aiven MySQL as in `.env`.

## Features

- **Auth:** Register, login, JWT + refresh cookie, protected routes
- **LMS:** Subjects → Sections → Videos, Udemy-style sidebar, lock/unlock by progress
- **Video:** YouTube player, progress saved every 5s, resume from last position, completion unlocks next
- **Chatbot:** Messaging-style UI, Hugging Face Inference API (e.g. Mistral)
- **UI:** Tailwind, minimal Udemy-like layout
