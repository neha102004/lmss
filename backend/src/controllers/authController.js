import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * POST /auth/register
 */
export async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true },
    });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({
      user: { id: user.id, email: user.email },
      accessToken,
      expiresIn: 900, // 15 min in seconds
    });
  } catch (err) {
    console.error('Register error:', err);
    const code = err?.code;
    if (code === 'P2002') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (code === 'P1001' || err?.message?.includes('connect')) {
      return res.status(503).json({ error: 'Database unavailable. Check that MySQL is running and DATABASE_URL is correct.' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
}

/**
 * POST /auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({
      user: { id: user.id, email: user.email },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
}

/**
 * POST /auth/refresh - get new access token using refresh cookie
 */
export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const { userId } = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const accessToken = generateAccessToken({ userId: user.id });
    res.json({ accessToken, expiresIn: 900 });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

/**
 * POST /auth/logout - clear refresh cookie
 */
export async function logout(req, res) {
  const opts = { path: '/' };
  if (process.env.NODE_ENV === 'production') {
    opts.sameSite = 'none';
    opts.secure = true;
  }
  res.clearCookie('refreshToken', opts);
  res.json({ message: 'Logged out' });
}

/**
 * GET /auth/me - current user (requires auth middleware - call after refresh)
 * For frontend: after refresh we have access token; call this to get user.
 */
export async function me(req, res) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
}
