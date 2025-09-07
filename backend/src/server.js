import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './utils/db.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import storeRoutes from './routes/store.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import { seedAdminIfNeeded } from './utils/seed.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (_req, res) => res.json({ ok: true, msg: 'Store Ratings API running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

// ✅ 404 handler (for all unknown routes)
app.use((req, res) => {
//   res.status(404);
  res.setHeader('Content-Type', 'text/html'); // Force without charset
  res.send(); // Truly empty
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await pool.getConnection();
    await seedAdminIfNeeded();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('DB error:', err.message);
  }
});
