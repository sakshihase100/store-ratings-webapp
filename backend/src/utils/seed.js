import bcrypt from 'bcryptjs';
import { pool } from './db.js';

export async function seedAdminIfNeeded() {
  await pool.query(`INSERT IGNORE INTO roles (id,name) VALUES (1,'ADMIN'),(2,'USER'),(3,'OWNER')`);
  const [rows] = await pool.query('SELECT id FROM users WHERE email=?', ['admin@demo.com']);
  if (!rows.length) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    await pool.query(
      'INSERT INTO users (name,email,address,password,role_id) VALUES (?,?,?,?,1)',
      ['System Admin Default', 'admin@demo.com', 'HQ', hash]
    );
    console.log('Default admin created: admin@demo.com / Admin@123');
  }
}
