import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import horoscopeRoutes from './routes/horoscope.routes';
import searchRoutes from './routes/search.routes';
import matchRoutes from './routes/match.routes';
import subscriptionRoutes from './routes/subscription.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Mount routes under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: 500,
  });
});

export { app };
