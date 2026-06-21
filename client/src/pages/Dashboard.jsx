import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await API.get('/expenses');
        const data = res.data;
        setExpenses(data);

        // Total
        const totalAmount = data.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        setTotal(totalAmount);

        // Group by category
        const grouped = data.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
          return acc;
        }, {});

        setSummary(Object.entries(grouped).map(([name, value]) => ({ name, value })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Dashboard</h2>

        {/* Summary Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Spent</p>
            <p style={styles.cardValue}>${total.toFixed(2)}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Transactions</p>
            <p style={styles.cardValue}>{expenses.length}</p>
          </div>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Categories</p>
            <p style={styles.cardValue}>{summary.length}</p>
          </div>
        </div>

        {/* Pie Chart */}
        {summary.length > 0 && (
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {summary.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Transactions */}
        <div style={styles.recent}>
          <h3 style={styles.chartTitle}>Recent Transactions</h3>
          {expenses.slice(0, 5).map((e) => (
            <div key={e.id} style={styles.transaction}>
              <div>
                <p style={styles.transCategory}>{e.category}</p>
                <p style={styles.transNote}>{e.note || '—'}</p>
              </div>
              <div style={styles.transRight}>
                <p style={styles.transAmount}>${parseFloat(e.amount).toFixed(2)}</p>
                <p style={styles.transDate}>{e.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  heading: { fontSize: '1.8rem', marginBottom: '1.5rem' },
  cards: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  card: {
    flex: 1,
    minWidth: '150px',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  cardLabel: { color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' },
  cardValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#4f46e5' },
  chartBox: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
  },
  chartTitle: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' },
  recent: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  transaction: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  transCategory: { fontWeight: '600', fontSize: '0.95rem' },
  transNote: { color: '#888', fontSize: '0.85rem' },
  transRight: { textAlign: 'right' },
  transAmount: { fontWeight: '600', color: '#4f46e5' },
  transDate: { color: '#888', fontSize: '0.8rem' },
};