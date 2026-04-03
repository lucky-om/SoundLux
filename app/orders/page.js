'use client';
import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/data';
import Link from 'next/link';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

function OrderTimeline({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="timeline" style={{ marginTop: '1rem' }}>
      {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label, i) => (
        <div key={label} className={`timeline-step${i <= currentIdx ? ' done' : ''}${i === currentIdx ? ' active' : ''}`}>
          <div className="timeline-dot">{i < currentIdx ? '✓' : i + 1}</div>
          <div className="timeline-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('soundlux_orders') || '[]');
    setOrders(stored);
  }, []);

  if (orders.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '5rem', opacity: 0.3 }}>📦</div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>No orders yet</h2>
      <p className="text-muted">Place your first order to track it here</p>
      <Link href="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>My <span className="gradient-text">Orders</span></h1>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>
      <div className="container section-sm" style={{ maxWidth: 860 }}>
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Order #{order.id}
                </div>
                <div className="text-sm text-muted">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={`order-status status-${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span style={{ fontWeight: 800, color: 'var(--neon-cyan)', fontFamily: 'Orbitron, sans-serif' }}>
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}>
                  <img src={item.image} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  {item.brand} {item.name} ×{item.quantity}
                </div>
              ))}
            </div>

            <OrderTimeline status={order.status} />

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <Link href={`/products`} className="btn btn-ghost btn-sm">Buy Again</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
