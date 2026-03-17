import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
// In production set FRONTEND_URL to your Vercel URL, e.g. https://your-app.vercel.app (comma-separated for multiple)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  ...FRONTEND_URL.split(',').map((u) => u.trim()).filter(Boolean),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (isProduction && origin && /^https:\/\/(.*\.vercel\.app|.*\.onrender\.com)$/.test(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);

// Health check (for Render)
app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`LMS Backend running on port ${PORT}`);
});
