import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { pool } from '../utils/db.js';

const router = Router();
router.use(auth);

router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;
  const r = Number(rating);
  if (!storeId || !(r >= 1 && r <= 5))
    return res.status(400).json({ message: 'Rating 1-5 required' });
  try {
    const [exists] = await pool.query('SELECT id FROM ratings WHERE user_id=? AND store_id=?', [userId, storeId]);
    if (exists.length) {
      await pool.query('UPDATE ratings SET rating=?, updated_at=NOW() WHERE id=?', [r, exists[0].id]);
      return res.json({ message: 'Rating updated' });
    }
    await pool.query('INSERT INTO ratings (user_id,store_id,rating) VALUES (?,?,?)', [userId, storeId, r]);
    res.json({ message: 'Rating added' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
