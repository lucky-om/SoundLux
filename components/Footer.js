'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎧</div>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.2rem', fontWeight: 900 }}>Sound<span style={{ color: 'var(--neon-cyan)' }}>Lux</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
              Premium headphones from the world's best brands. Experience music the way it was meant to be heard.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[
                { label: '𝕏', key: 'x' },
                { label: 'IG', key: 'in' },
                { label: 'YT', key: 'yt' },
                { label: 'in', key: 'ln' }
              ].map(icon => (
                <Link key={icon.key} href="/" style={{
                  width: 36, height: 36, background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s',
                  color: 'var(--text-secondary)'
                }}>{icon.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--neon-cyan)' }}>Shop</div>
            {[['All Products', '/products'], ['Wireless', '/categories/wireless'], ['Gaming', '/categories/gaming'], ['Studio', '/categories/studio'], ['Noise Cancelling', '/categories/noise-cancelling']].map(([label, href]) => (
              <div key={href} style={{ marginBottom: '0.5rem' }}>
                <Link href={href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--neon-cyan)' }}>Account</div>
            {[['Login', '/auth/login'], ['Sign Up', '/auth/signup'], ['My Orders', '/orders'], ['Cart', '/cart']].map(([label, href]) => (
              <div key={href} style={{ marginBottom: '0.5rem' }}>
                <Link href={href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--neon-cyan)' }}>Support</div>
            {[
              { label: 'FAQ', href: '/support/faq' },
              { label: 'Shipping Policy', href: '/support/shipping' },
              { label: 'Returns', href: '/support/returns' },
              { label: 'Contact Us', href: '/support/contact' },
              { label: 'Track Order', href: '/orders' }
            ].map(item => (
              <div key={item.label} style={{ marginBottom: '0.5rem' }}>
                <Link href={item.href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>{item.label}</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center', paddingBottom: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div className="hack-badge" style={{ marginBottom: '1rem' }}>
              INFERNO'26 : HACKOVERFLOW
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Developed proudly by our team for SDJ International College</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {[
              { name: 'Patel Om', github: 'lucky-om' },
              { name: 'Patil Bhoomika', github: 'PatilBhumika28' },
              { name: 'Rana Krish', github: 'Krishrana7' },
              { name: 'Rana Shraddha', github: 'Rana-Shraddha' },
              { name: 'Gautam Aryan', github: 'Aryan-Gautam-8141' }
            ].map((member) => (
              <a key={member.name} href={`https://github.com/${member.name}`} target="_blank" rel="noopener noreferrer" className="team-card" title="View GitHub Profile">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-cyan)', boxShadow: '0 0 8px var(--neon-cyan)' }}></div>
                {member.name}
              </a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 SoundLux. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['VISA', 'Mastercard', 'PayPal', 'Rupay'].map((label, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '0.3rem 0.6rem', fontSize: '0.75rem',
                fontWeight: 700, color: 'var(--text-muted)', fontStyle: 'italic',
                fontFamily: 'Orbitron, sans-serif'
              }}>{label}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
