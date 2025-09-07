import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { pool } from '../utils/db.js';

const router = Router();
router.use(auth);

// GET all stores with avgRating and userRating
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const q = `%${(req.query.q || '').trim()}%`;
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(AVG(r.rating),1) AS avgRating,
              (SELECT rating FROM ratings WHERE user_id=? AND store_id=s.id) AS userRating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id=s.id
       WHERE s.name LIKE ? OR s.address LIKE ?
       GROUP BY s.id`,
      [userId, q, q]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new store (admin/owner)
router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { name, email, address } = req.body;

  try {
    // Save store and assign owner_user_id if user is owner
    const [userRows] = await pool.query(
      'SELECT role_id FROM users WHERE id=?',
      [userId]
    );
    if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

    const roleId = userRows[0].role_id;

    // Only admin (role_id=1) or owner (role_id=3) can add stores
    if (![1, 3].includes(roleId)) return res.status(403).json({ message: 'Unauthorized' });

    const ownerId = roleId === 3 ? userId : null; // if owner, set as store owner
    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_user_id) VALUES (?, ?, ?, ?)',
      [name, email || null, address, ownerId]
    );

    res.status(201).json({ message: 'Store added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add store' });
  }
});

export default router;
