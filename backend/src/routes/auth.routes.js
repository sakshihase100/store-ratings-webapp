import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../utils/db.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, email, address, password, role } = req.body;
  if (!name || name.length < 2) return res.status(400).json({ message: 'Name too short' });
  if (!role) return res.status(400).json({ message: 'Role is required' });

  // Map role to role_id
  const roleId = role.toUpperCase() === 'ADMIN' ? 1 : role.toUpperCase() === 'OWNER' ? 3 : 2;

  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name,email,address,password,role_id) VALUES (?,?,?,?,?)',
      [name, email, address, hash, roleId]
    );

    res.json({ message: 'Sign up success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT u.id,u.name,u.password,r.name as role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=?',
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
