'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🎧' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>⚡ ADMIN PANEL</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>SoundLux Control</div>
        </div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`admin-nav-link${pathname === n.href ? ' active' : ''}`}>
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', marginTop: 'auto', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Link href="/" className="btn btn-ghost btn-sm btn-full">← Back to Store</Link>
        </div>
      </aside>
      <div className="admin-content">{children}</div>
    </div>
  );
}
