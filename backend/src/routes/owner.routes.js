import { Router } from 'express';
import { auth, permit } from '../middleware/auth.js';
import { pool } from '../utils/db.js';

const router = Router();
router.use(auth, permit('OWNER||USER'));

router.get('/my-store-ratings', async (req, res) => {
  try {
    const userId = req.user.id;
    const [storeRows] = await pool.query('SELECT id FROM stores WHERE owner_user_id=? LIMIT 1', [userId]);
    if (!storeRows.length) return res.json({ avg: null, ratings: [] });
    const storeId = storeRows[0].id;
    const [[{ avg }]] = await pool.query('SELECT ROUND(AVG(rating),1) AS avg FROM ratings WHERE store_id=?', [storeId]);
    const [ratings] = await pool.query(
      'SELECT u.name,u.email,r.rating,r.updated_at FROM ratings r JOIN users u ON u.id=r.user_id WHERE r.store_id=?',
      [storeId]
    );
    res.json({ avg, ratings });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
