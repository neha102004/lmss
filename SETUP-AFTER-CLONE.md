# Setup after cloning from GitHub

Follow these steps so the project runs correctly.

## 1. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run db:use-sqlite
```

- **Windows (PowerShell):** `copy .env.example .env`
- **Mac/Linux:** `cp .env.example .env`

`npm run db:use-sqlite` creates the local SQLite database, seeds courses, and updates `.env` to use it. No MySQL or Aiven needed.

Then start the backend:

```bash
npm run dev
```

You should see: **LMS Backend running on port 5000**.

## 2. Frontend

Open a **new terminal**:

```bash
cd frontend
copy .env.local.example .env.local
npm install --ignore-scripts
npm run dev
```

- **Windows:** `copy .env.local.example .env.local`
- **Mac/Linux:** `cp .env.local.example .env.local`

You should see: **Local: http://localhost:3000** (or 3001).

## 3. Use the app

1. Open **http://localhost:3000** (or the URL shown).
2. **Register** with any email/password, or **Log in** with:
   - Email: `demo@lms.com`
   - Password: `demo123`
3. Open a course and watch videos; progress is saved.

## If something fails

- **Backend "Can't reach database server"** — You're not using SQLite. Run `npm run db:use-sqlite` in the `backend` folder.
- **Frontend "next is not recognized"** — Run `npm install --ignore-scripts` in the `frontend` folder, then `npm run dev` again.
- **Registration/Login "Cannot connect to server"** — Start the backend first (`cd backend` then `npm run dev`), then refresh the frontend.

See **TROUBLESHOOTING.md** for more.
