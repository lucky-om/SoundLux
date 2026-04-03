'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/store';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, user } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/categories/wireless', label: 'Wireless' },
    { href: '/categories/gaming', label: 'Gaming' },
    { href: '/categories/studio', label: 'Studio' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">🎧</div>
            <span className="nav-logo-text">Sound<span>Lux</span></span>
          </Link>

          <div className="nav-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <Link href="/orders" className="btn btn-ghost btn-sm desktop-only">My Orders</Link>
                <Link href="/wishlist" className="btn btn-ghost btn-sm desktop-only">Wishlist</Link>
                {user.user_metadata?.role === 'admin' && (
                  <Link href="/admin" className="btn btn-ghost btn-sm desktop-only">Admin</Link>
                )}
                <a href="/auth/logout" className="btn btn-ghost btn-sm desktop-only">Logout</a>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm desktop-only">Login</Link>
                <Link href="/auth/signup" className="btn btn-primary btn-sm desktop-only">Sign Up</Link>
              </>
            )}
            <button className="nav-cart-btn" onClick={() => setCartOpen(true)} id="open-cart-btn">
              🛒
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="nav-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-card)' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}>{l.label}</Link>
            ))}
            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
            {user ? (
              <>
                 <Link href="/orders" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>My Orders</Link>
                 <Link href="/wishlist" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                 {user.user_metadata?.role === 'admin' && (
                    <Link href="/admin" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Admin</Link>
                 )}
                 <a href="/auth/logout" className="btn btn-danger btn-sm" onClick={() => setMenuOpen(false)}>Logout</a>
              </>
            ) : (
              <>
                 <Link href="/auth/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                 <Link href="/auth/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
