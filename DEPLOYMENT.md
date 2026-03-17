# Deployment guide (Render + Vercel)

When the app is deployed, the frontend (Vercel) and backend (Render) run on different URLs. These settings make it work.

---

## 1. Backend (Render)

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your GitHub repo: **neha102004/lmss**.
3. **Build & start:**
   - **Root Directory:** leave empty (repo root).
   - **Build Command:** `cd backend && npm install && npm run db:generate`
   - **Start Command:** `cd backend && npm start`
   - Or set **Root Directory** to `backend`, then Build: `npm install && npm run db:generate`, Start: `npm start`.

4. **Environment variables** (required):

   | Variable | Value |
   |----------|--------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Your **Aiven MySQL** connection string (Render cannot use SQLite) |
   | `JWT_ACCESS_SECRET` | Long random string (min 32 characters) |
   | `JWT_REFRESH_SECRET` | Long random string (min 32 characters) |
   | `FRONTEND_URL` | Your Vercel app URL, e.g. `https://your-app.vercel.app` |
   | `HUGGINGFACE_API_KEY` | Your Hugging Face token (optional, for chatbot) |

5. **Database:** Run migrations once. In Render **Shell** (or locally with `DATABASE_URL` set to the same Aiven URL):
   ```bash
   cd backend && npx prisma db push && npx prisma db seed
   ```
   Or use a one-off job / run it from your machine with the production `DATABASE_URL`.

6. After deploy, note your backend URL, e.g. `https://lms-xxxx.onrender.com`.

---

## 2. Frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com): **neha102004/lmss**.
2. **Root Directory:** `frontend` (or leave empty and set in project settings).
   - If root is repo root: set **Root Directory** to `frontend`.
3. **Environment variable:**

   | Variable | Value |
   |----------|--------|
   | `NEXT_PUBLIC_API_URL` | Your Render backend URL, e.g. `https://lms-xxxx.onrender.com` |

4. Deploy. Vercel will build and host the frontend.

---

## 3. Checklist

- [ ] **Backend:** `NODE_ENV=production`, `DATABASE_URL` (Aiven MySQL), `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL` (exact Vercel URL) are set on Render.
- [ ] **Frontend:** `NEXT_PUBLIC_API_URL` (exact Render URL, no trailing slash) is set on Vercel.
- [ ] **Database:** Tables created and seeded (`prisma db push` + `prisma db seed`) using the same `DATABASE_URL`.
- [ ] **HTTPS:** Both backend and frontend use **https**. The app uses `SameSite=None` cookies in production, which require HTTPS.

---

## 4. If it still doesn’t work

- **Login/Register fails or “Cannot connect to server”**  
  - Check `NEXT_PUBLIC_API_URL` on Vercel: must be the full Render URL (e.g. `https://lms-xxxx.onrender.com`) with no trailing slash.
  - Redeploy the frontend after changing env vars (Vercel bakes `NEXT_PUBLIC_*` into the build).

- **CORS errors in browser**  
  - Set `FRONTEND_URL` on Render to your exact Vercel URL (e.g. `https://lmss.vercel.app`).
  - Backend allows `*.vercel.app` and `*.onrender.com` in production; if you use a custom domain, add it to `FRONTEND_URL` (comma-separated for multiple).

- **Cookies / session not working**  
  - Backend uses `SameSite=None; Secure` in production so cookies work cross-origin. Both backend and frontend must be **https**.

- **Backend “Database unavailable”**  
  - Use **Aiven MySQL** (or another hosted MySQL) and set `DATABASE_URL` on Render. SQLite is not suitable on Render.

- **502 / Backend not starting**  
  - Check Render logs. Ensure `npm run db:generate` runs in the build step and `DATABASE_URL` is set. If you use **Root Directory** `backend`, start command is `npm start`.
