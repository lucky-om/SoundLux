'use client';
import { useState } from 'react';
import { formatPrice } from '@/lib/data';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const DEMO_ORDERS = [
  { id: 'SL-12345678', customer: 'Rahul Sharma', email: 'rahul@example.com', amount: 29990, status: 'delivered', date: '2026-03-30', items: [{ name: 'Sony WH-1000XM5', qty: 1 }] },
  { id: 'SL-87654321', customer: 'Priya Mehta', email: 'priya@example.com', amount: 14999, status: 'shipped', date: '2026-03-31', items: [{ name: 'JBL Quantum 910', qty: 1 }] },
  { id: 'SL-11223344', customer: 'Arjun Patel', email: 'arjun@example.com', amount: 45000, status: 'processing', date: '2026-04-01', items: [{ name: 'Sennheiser HD 660S2', qty: 1 }] },
  { id: 'SL-99887766', customer: 'Neha Singh', email: 'neha@example.com', amount: 12990, status: 'pending', date: '2026-04-02', items: [{ name: 'Audio-Technica ATH-M50x', qty: 1 }] },
  { id: 'SL-55443322', customer: 'Vikram Nair', email: 'vikram@example.com', amount: 59900, status: 'delivered', date: '2026-03-28', items: [{ name: 'Apple AirPods Max', qty: 1 }] },
  { id: 'SL-33221100', customer: 'Anjali Desai', email: 'anjali@example.com', amount: 19990, status: 'shipped', date: '2026-03-29', items: [{ name: 'Sony WF-1000XM5', qty: 1 }] },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o =>
    (statusFilter === 'all' || o.status === statusFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem' }}>Order <span className="gradient-text">Management</span></h1>
        <p className="text-muted text-sm">{orders.length} total orders · {formatPrice(totalRevenue)} revenue</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder="🔍 Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map(s => (
            <button key={s} className={`filter-chip${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,212,255,0.03)' }}>
              {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Update'].map(h => (
                <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.9rem 1rem', fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', color: 'var(--neon-cyan)' }}>{o.id}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{o.customer}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.email}</div>
                </td>
                <td style={{ padding: '0.9rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {o.items?.map(i => i.name).join(', ')}
                </td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, fontSize: '0.875rem' }}>{formatPrice(o.amount)}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span className={`order-status status-${o.status}`}>{o.status}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{o.date}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <select
                    className="sort-select"
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</div>
        )}
      </div>
    </div>
  );
}
