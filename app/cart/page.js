'use client';
import { useCart } from '@/lib/store';
import { formatPrice, COUPONS } from '@/lib/data';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const shipping = cartTotal > 5000 ? 0 : 149;
  const tax = Math.round(cartTotal * 0.18);
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(cartTotal * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const total = cartTotal + shipping + tax - discount;

  const applyCoupon = () => {
    const found = COUPONS.find(c => c.code === coupon.toUpperCase());
    if (!found) { setCouponError('Invalid coupon code'); return; }
    if (cartTotal < found.minOrder) { setCouponError(`Minimum order ${formatPrice(found.minOrder)} required`); return; }
    setAppliedCoupon(found);
    setCouponError('');
  };

  if (cart.length === 0) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '5rem', opacity: 0.3 }}>🛒</div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>Your cart is empty</h2>
      <p className="text-muted">Add some premium headphones to get started</p>
      <Link href="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Your <span className="gradient-text">Cart</span></h1>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="checkout-grid">
          <div>
            {cart.map(item => (
              <div key={item.id} className="glass" style={{ borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 10, padding: '0.5rem', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{item.brand}</div>
                  <div style={{ fontWeight: 700, margin: '0.2rem 0 0.75rem' }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="order-summary-card">
            <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>
            <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--neon-green)' }}>Free</span> : formatPrice(shipping)}</span></div>
            <div className="cart-summary-row"><span>Tax (18% GST)</span><span>{formatPrice(tax)}</span></div>
            {appliedCoupon && (
              <div className="cart-summary-row" style={{ color: 'var(--neon-green)' }}>
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="divider" />
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">{formatPrice(total)}</span>
            </div>

            {/* Coupon */}
            {!appliedCoupon && (
              <div className="coupon-row">
                <input
                  className="input"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                  onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  id="coupon-input"
                />
                <button className="btn btn-outline" onClick={applyCoupon}>Apply</button>
              </div>
            )}
            {appliedCoupon && (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span style={{ color: 'var(--neon-green)', fontSize: '0.85rem' }}>✅ {appliedCoupon.code} applied!</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAppliedCoupon(null)}>✕</button>
              </div>
            )}
            {couponError && <div className="text-danger text-sm" style={{ marginTop: '0.5rem' }}>{couponError}</div>}

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.25rem' }}
              onClick={() => { window.location.href = '/checkout'; }}
            >
              Proceed to Checkout →
            </button>
            <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <div className="text-xs text-muted">🔒 Secure checkout — SSL encrypted</div>
              <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                Try codes: HACKOVER10 · SOUND500 · NEWUSER20
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
