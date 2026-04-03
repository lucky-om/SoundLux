'use client';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=success
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const { user, loading } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [payMethod, setPayMethod] = useState('dummy');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  const shipping = cartTotal > 5000 ? 0 : 149;
  const tax = Math.round(cartTotal * 0.18);
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent' ? Math.round(cartTotal * appliedCoupon.value / 100) : appliedCoupon.value
    : 0;
  const total = cartTotal + shipping + tax - discount;

  const applyCoupon = async () => {
    const { supabase } = await import('@/lib/supabase');
    const { data: found, error } = await supabase.from('coupons').select('*').eq('code', coupon.toUpperCase()).single();
    if (error || !found) { setCouponError('Invalid coupon code'); return; }
    if (cartTotal < found.min_order) { setCouponError(`Minimum order ${formatPrice(found.min_order)} required`); return; }
    setAppliedCoupon({
      code: found.code,
      type: found.discount_type,
      value: found.discount_value
    });
    setCouponError('');
  };

  const validateAddress = () => {
    const { firstName, lastName, email, phone, address, city, state, pincode } = form;
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !pincode) {
      alert("Please fill in all mandatory address details to continue.");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    const newOrderId = 'SL-' + Date.now().toString().slice(-8);
    setOrderId(newOrderId);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('orders').insert({
        order_number: newOrderId,
        user_id: user.id,
        items: cart,
        subtotal: cartTotal,
        shipping,
        tax,
        discount,
        total,
        status: 'processing',
        shipping_address: form,
        payment_method: payMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
      });

      if (error) {
         console.error(error);
         alert('Order could not be placed due to an error.');
         setProcessing(false);
         return;
      }

      clearCart();
      setProcessing(false);
      setStep(3);
    } catch (err) {
      console.error(err);
      setProcessing(false);
    }
  };

  if (cart.length === 0 && step !== 3) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '5rem', opacity: 0.3 }}>🛒</div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif' }}>Your cart is empty</h2>
      <Link href="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
    </div>
  );

  // Success screen
  if (step === 3) return (
    <div className="success-overlay">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <div className="success-title">Order Placed!</div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Order ID: <strong style={{ color: 'var(--neon-cyan)' }}>{orderId}</strong></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
          🎧 Your headphones are being packed!<br />
          You&apos;ll receive a confirmation soon.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/orders" className="btn btn-primary">Track Order</Link>
          <Link href="/products" className="btn btn-ghost">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', alignItems: 'center' }}>
            {['Shipping', 'Payment', 'Review'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                  background: step > i + 1 ? 'var(--neon-green)' : step === i + 1 ? 'var(--neon-cyan)' : 'var(--bg-card)',
                  color: step >= i + 1 ? '#000' : 'var(--text-muted)',
                  border: step === i + 1 ? '2px solid var(--neon-cyan)' : '1px solid var(--border)',
                }}>{step > i + 1 ? '✓' : i + 1}</div>
                <span style={{ fontSize: '0.85rem', color: step === i + 1 ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>{s}</span>
                {i < 2 && <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div className="checkout-grid">
          <div>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <div className="checkout-section">
                  <div className="checkout-section-title">📦 Shipping Address</div>
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">First Name</label>
                      <input className="input" placeholder="Om" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Last Name</label>
                      <input className="input" placeholder="Patel" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ height: '1rem' }} />
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">Email</label>
                      <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Phone</label>
                      <input className="input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ height: '1rem' }} />
                  <div className="input-group">
                    <label className="input-label">Street Address</label>
                    <input className="input" placeholder="123, Mahatma Gandhi Road" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  </div>
                  <div style={{ height: '1rem' }} />
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">City</label>
                      <input className="input" placeholder="Surat" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">State</label>
                      <input className="input" placeholder="Gujarat" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ height: '1rem' }} />
                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">Pincode</label>
                      <input className="input" placeholder="390001" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Country</label>
                      <input className="input" value={form.country} readOnly />
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={validateAddress} style={{ width: '100%' }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <div className="checkout-section">
                  <div className="checkout-section-title">💳 Payment Method</div>
                  {[
                    { id: 'dummy', icon: '💳', label: 'Cards', desc: 'Pay using your Debit/Credit Card' },
                    { id: 'razorpay', icon: '🏦', label: 'Razorpay', desc: 'UPI, Net Banking, Online Payments' },
                    { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  ].map(method => (
                    <div
                      key={method.id}
                      className={`payment-method${payMethod === method.id ? ' selected' : ''}`}
                      onClick={() => setPayMethod(method.id)}
                      style={{ cursor: 'pointer', marginBottom: '0.75rem' }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payMethod === method.id ? 'var(--neon-cyan)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {payMethod === method.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--neon-cyan)' }} />}
                      </div>
                      <span className="payment-icon">{method.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{method.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{method.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon in  checkout */}
                <div className="checkout-section">
                  <div className="checkout-section-title">🏷️ Coupon Code</div>
                  {!appliedCoupon ? (
                    <>
                      <div className="coupon-row" style={{ marginTop: 0 }}>
                        <input className="input" placeholder="e.g. HACKOVER10" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError(''); }} />
                        <button className="btn btn-outline" onClick={applyCoupon}>Apply</button>
                      </div>
                      {couponError && <div className="text-danger text-sm" style={{ marginTop: '0.5rem' }}>{couponError}</div>}
                      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valid codes: HACKOVER10 · SOUND500 · NEWUSER20</div>
                    </>
                  ) : (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--neon-green)' }}>✅ {appliedCoupon.code} — {formatPrice(discount)} off</span>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setAppliedCoupon(null)}>✕</button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '1rem', padding: '0.9rem' }}
                    onClick={() => setStep(3.5)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2.5 → Review + Place Order */}
            {step === 3.5 && (
              <div>
                <div className="checkout-section">
                  <div className="checkout-section-title">📋 Order Review</div>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 8, padding: '0.4rem' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.brand} {item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                  <div className="divider" />
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>Ship to:</strong> {form.firstName} {form.lastName}, {form.address}, {form.city} - {form.pincode}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '1rem', padding: '0.9rem' }}
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    id="place-order-btn"
                  >
                    {processing ? '⏳ Processing...' : `🎧 Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="order-summary-card">
            <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <img src={item.image} alt="" style={{ width: 48, height: 48, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 6, padding: '0.3rem' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{item.quantity}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
            <div className="divider" />
            <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--neon-green)' }}>Free</span> : formatPrice(shipping)}</span></div>
            <div className="cart-summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
            {appliedCoupon && <div className="cart-summary-row" style={{ color: 'var(--neon-green)' }}><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">{formatPrice(total)}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>🔒 SSL Secured · GST inclusive</div>
          </div>
        </div>
      </div>
    </>
  );
}
