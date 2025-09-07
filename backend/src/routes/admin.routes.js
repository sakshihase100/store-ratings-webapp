import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { pool } from '../utils/db.js';
import bcrypt from 'bcryptjs';

const router = Router();
router.use(auth, permit('ADMIN'));

// Dashboard stats
router.get('/stats', async (_req, res) => {
  try {
    const [[{ users }]] = await pool.query('SELECT COUNT(*) AS users FROM users');
    const [[{ stores }]] = await pool.query('SELECT COUNT(*) AS stores FROM stores');
    const [[{ ratings }]] = await pool.query('SELECT COUNT(*) AS ratings FROM ratings');
    res.json({ users, stores, ratings });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// List users
router.get('/users', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT u.id,u.name,u.email,u.address,r.name as role FROM users u JOIN roles r ON r.id=u.role_id'
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user
router.post('/users', async (req, res) => {
  const { name, email, address, password, role } = req.body;
  if (!name || !email || !address || !password || !role)
    return res.status(400).json({ message: 'All fields required' });

  const roleId = role === 'ADMIN' ? 1 : role === 'OWNER' ? 3 : 2;

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name,email,address,password,role_id) VALUES (?,?,?,?,?)',
      [name, email, address, hash, roleId]
    );
    res.json({ message: 'User added' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// List stores
router.get('/stores', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),1) AS avgRating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id=s.id
       GROUP BY s.id`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add store
router.post('/stores', async (req, res) => {
  const { name, email, address, ownerUserId } = req.body;
  if (!name || !address) return res.status(400).json({ message: 'Name & address required' });
  try {
    await pool.query(
      'INSERT INTO stores (name,email,address,owner_user_id) VALUES (?,?,?,?)',
      [name, email || null, address, ownerUserId || null]
    );
    res.json({ message: 'Store added' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
