'use client';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer({ onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const shipping = cartTotal > 5000 ? 0 : 149;
  const tax = Math.round(cartTotal * 0.18);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div>
            <div className="cart-drawer-title">🛒 Your Cart</div>
            <div className="text-sm text-muted">{cartCount} item{cartCount !== 1 ? 's' : ''}</div>
          </div>
          <button className="cart-close-btn" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🎧</div>
            <div style={{ fontWeight: 600 }}>Your cart is empty</div>
            <div className="text-sm text-muted">Discover premium headphones</div>
            <Link href="/products" className="btn btn-primary btn-sm" onClick={onClose}>Shop Now</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-brand">{item.brand}</div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="flex flex-between" style={{ marginTop: '0.5rem' }}>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">{formatPrice(item.price * item.quantity)}</span>
                      <button className="cart-item-del" onClick={() => removeFromCart(item.id)} title="Remove">🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              {cartTotal >= 5000 ? (
                <div className="text-sm" style={{ color: 'var(--neon-green)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ✅ Free shipping applied!
                </div>
              ) : (
                <div className="text-sm text-muted" style={{ marginBottom: '0.75rem' }}>
                  Add {formatPrice(5000 - cartTotal)} more for free shipping
                </div>
              )}
              <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--neon-green)' }}>Free</span> : formatPrice(shipping)}</span></div>
              <div className="cart-summary-row"><span>Tax (18% GST)</span><span>{formatPrice(tax)}</span></div>
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-amount">{formatPrice(cartTotal + shipping + tax)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary btn-full" onClick={onClose}>
                Proceed to Checkout →
              </Link>
              <button className="btn btn-ghost btn-full" style={{ marginTop: '0.75rem' }} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
