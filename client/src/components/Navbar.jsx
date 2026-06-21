import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>💰 ExpenseTracker</div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/expenses" style={styles.link}>Expenses</Link>
        <span style={styles.user}>👤 {user?.name}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#4f46e5',
    color: '#fff',
  },
  logo: { fontSize: '1.3rem', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.95rem' },
  user: { fontSize: '0.9rem', opacity: 0.85 },
  button: {
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    border: '1px solid #fff',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};