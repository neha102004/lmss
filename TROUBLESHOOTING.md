# Troubleshooting

## EPERM when running `npm run db:use-sqlite`

If you see **EPERM: operation not permitted, rename ... query_engine-windows.dll.node**:

- The SQLite client is now generated to a **separate folder**, so the default Prisma client is no longer overwritten. Run again:
  ```bash
  cd backend
  npm run db:use-sqlite
  ```
- If it still fails, **stop the backend** (Ctrl+C in the terminal where `npm run dev` is running), then run `npm run db:use-sqlite` again.

---

## "Can't reach database server" or Registration fails with "Database unavailable"

**Quick fix — use SQLite (no Aiven needed):**

From the project folder:

```bash
cd backend
npm run db:use-sqlite
```

Then start the backend (`npm run dev`) and try registering again. The app will use a local SQLite file (`prisma/dev.db`) instead of Aiven MySQL.

**If you want to keep using Aiven MySQL:**

1. Open [Aiven Console](https://console.aiven.io) and sign in.
2. Select your MySQL service and ensure it is **Running** (start/resume if paused).
3. Run:
   ```bash
   cd backend
   npm run db:push
   npm run db:seed
   ```
4. Try registering again at http://localhost:3000/register.

---

## Error: "Can't reach database server" when running `db:push`

Same as above: your Aiven MySQL service must be **running**. Start it from the [Aiven Console](https://console.aiven.io), then run `npm run db:push` again from the `backend` folder.

---

## Frontend: 'next' is not recognized

**Fix:** Run the dev server with the project’s Node script (no global `next` needed):

```bash
cd frontend
npm run dev
```

If you still see the error:

1. Install dependencies (skip scripts to avoid path issues):
   ```bash
   cd frontend
   npm install --ignore-scripts
   ```
2. Then run:
   ```bash
   npm run dev
   ```

---

## "Cannot connect to server" on Register or Login

**Cause:** The backend is not running or the frontend is pointing to the wrong URL.

**Fix:**

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `LMS Backend running on port 5000`.

2. Ensure frontend `.env.local` has:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Restart the frontend (`npm run dev` in the `frontend` folder), then try again.

---

## Backend won’t start (e.g. port in use)

If port 5000 is already in use:

1. Set another port in `backend/.env`:
   ```env
   PORT=5001
   ```
2. In `frontend/.env.local` set:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```
3. Restart backend and frontend.
