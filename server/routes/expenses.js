import express from 'express';
import pool from '../config/db.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Get all expenses for logged in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add expense
router.post('/', verifyToken, async (req, res) => {
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, amount, category, note, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, amount, category, note, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', verifyToken, async (req, res) => {
  const { amount, category, note, date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE expenses SET amount=$1, category=$2, note=$3, date=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [amount, category, note, date, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM expenses WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;