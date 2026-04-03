'use client';
import { PRODUCTS, CATEGORIES, formatPrice } from '@/lib/data';
import Link from 'next/link';

const MOCK_REVENUE = [
  { month: 'Oct', rev: 48000 },
  { month: 'Nov', rev: 72000 },
  { month: 'Dec', rev: 95000 },
  { month: 'Jan', rev: 63000 },
  { month: 'Feb', rev: 88000 },
  { month: 'Mar', rev: 114000 },
];
const maxRev = Math.max(...MOCK_REVENUE.map(r => r.rev));

const TOP_PRODUCTS = PRODUCTS.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

const RECENT_ORDERS = [
  { id: 'SL-12345678', customer: 'Rahul Sharma', amount: 29990, status: 'delivered', date: '2026-03-30' },
  { id: 'SL-87654321', customer: 'Priya Mehta', amount: 14999, status: 'shipped', date: '2026-03-31' },
  { id: 'SL-11223344', customer: 'Arjun Patel', amount: 45000, status: 'processing', date: '2026-04-01' },
  { id: 'SL-99887766', customer: 'Neha Singh', amount: 12990, status: 'pending', date: '2026-04-02' },
];

export default function AdminDashboard() {
  const totalRevenue = MOCK_REVENUE.reduce((sum, r) => sum + r.rev, 0);
  const totalProducts = PRODUCTS.length;
  const totalOrders = RECENT_ORDERS.length + 8;
  const avgRating = (PRODUCTS.reduce((s, p) => s + p.rating, 0) / PRODUCTS.length).toFixed(1);

  const stats = [
    { icon: '💰', label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, color: 'var(--neon-cyan)' },
    { icon: '📦', label: 'Total Orders', value: totalOrders, color: 'var(--neon-purple)' },
    { icon: '🎧', label: 'Products', value: totalProducts, color: 'var(--neon-amber)' },
    { icon: '⭐', label: 'Avg Rating', value: avgRating, color: 'var(--neon-green)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem' }}>
          Dashboard <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>Welcome back, Admin · Last updated just now</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Revenue chart */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📈 Monthly Revenue</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: 180 }}>
            {MOCK_REVENUE.map(r => (
              <div key={r.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--neon-cyan)' }}>₹{(r.rev / 1000).toFixed(0)}K</div>
                <div style={{
                  width: '100%',
                  height: `${(r.rev / maxRev) * 140}px`,
                  background: 'linear-gradient(to top, var(--neon-cyan), var(--neon-purple))',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s',
                  opacity: 0.85,
                }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>🏆 Top Products</h3>
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--neon-amber)', minWidth: 20 }}>#{i + 1}</span>
              <img src={p.image} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.brand} {p.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.reviewCount.toLocaleString()} reviews</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>{formatPrice(p.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories distribution */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>📊 Category Distribution</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['wireless','noise-cancelling','gaming','studio','earbuds','budget'].map(slug => {
            const count = PRODUCTS.filter(p => p.category === slug).length;
            const pct = Math.round((count / PRODUCTS.length) * 100);
            return (
              <div key={slug} style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'capitalize' }}>{slug.replace('-', ' ')}</div>
                <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))', borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', marginTop: '0.25rem', fontWeight: 600 }}>{count} products ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3>🕒 Recent Orders</h3>
          <Link href="/admin/orders" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'Orbitron, sans-serif', fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>{o.id}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{o.customer}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, fontSize: '0.875rem' }}>{formatPrice(o.amount)}</td>
                  <td style={{ padding: '0.75rem' }}><span className={`order-status status-${o.status}`}>{o.status}</span></td>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
