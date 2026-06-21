import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Other'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: 'Food', note: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, form);
        setEditId(null);
      } else {
        await API.post('/expenses', form);
      }
      setForm({ amount: '', category: 'Food', note: '', date: '' });
      setError('');
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (expense) => {
    setEditId(expense.id);
    setForm({
      amount: expense.amount,
      category: expense.category,
      note: expense.note || '',
      date: expense.date,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Expenses</h2>

        {/* Form */}
        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>{editId ? 'Edit Expense' : 'Add Expense'}</h3>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              type="number"
              name="amount"
              placeholder="Amount ($)"
              value={form.amount}
              onChange={handleChange}
              required
            />
            <select
              style={styles.input}
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              style={styles.input}
              type="text"
              name="note"
              placeholder="Note (optional)"
              value={form.note}
              onChange={handleChange}
            />
            <input
              style={styles.input}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <div style={styles.formButtons}>
              <button style={styles.button} type="submit">
                {editId ? 'Update' : 'Add Expense'}
              </button>
              {editId && (
                <button
                  style={styles.cancelButton}
                  type="button"
                  onClick={() => { setEditId(null); setForm({ amount: '', category: 'Food', note: '', date: '' }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div style={styles.tableBox}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Date', 'Category', 'Note', 'Amount', 'Actions'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr><td colSpan={5} style={styles.empty}>No expenses yet</td></tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} style={styles.tr}>
                    <td style={styles.td}>{e.date}</td>
                    <td style={styles.td}>{e.category}</td>
                    <td style={styles.td}>{e.note || '—'}</td>
                    <td style={styles.td}>${parseFloat(e.amount).toFixed(2)}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(e)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(e.id)} style={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  heading: { fontSize: '1.8rem', marginBottom: '1.5rem' },
  formBox: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  formTitle: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' },
  error: { color: 'red', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexWrap: 'wrap', gap: '1rem' },
  input: {
    flex: '1 1 180px',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
  },
  formButtons: { display: 'flex', gap: '0.5rem', width: '100%' },
  button: {
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  tableBox: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '1rem',
    background: '#f8f8f8',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#555',
  },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '1rem', fontSize: '0.95rem' },
  empty: { padding: '2rem', textAlign:'center', color: '#888' },
  editBtn: {
    marginRight: '0.5rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    border: 'none',
    background: '#10b981',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    padding: '0.3rem 0.8rem',
    borderRadius: '6px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
};