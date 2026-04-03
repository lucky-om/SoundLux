import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, getFeaturedProducts } from '@/lib/data';

export default function HomePage() {
  const featured = getFeaturedProducts();
  const topPicks = PRODUCTS.slice(0, 4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="animate-fade">
              <div className="hero-badge">
                <span>🏆</span>
                <span>Hackoverflow 2026 — SDJ International</span>
              </div>
              <h1>
                <span className="gradient-text">Next-Level</span><br />
                Sound Experience
              </h1>
              <p>Discover the world&apos;s finest headphones from Sony, Bose, Apple, and more. Premium audio, engineered for perfection.</p>
              <div className="hero-actions">
                <Link href="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                  🎧 Shop Now
                </Link>
                <Link href="/categories/noise-cancelling" className="btn btn-ghost btn-lg">
                  Explore ANC →
                </Link>
              </div>
              <div className="hero-stats">
                {[
                  { num: '12+', label: 'Premium Brands' },
                  { num: '50K+', label: 'Happy Customers' },
                  { num: '4.8★', label: 'Average Rating' },
                ].map(s => (
                  <div key={s.num}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-3d-scene">
                <div className="hero-glow-ring" />
                <div className="hero-orbit" />
                <img
                  src="/images/B09XS7JWHH.png"
                  alt="Sony WH-1000XM5 Premium Headphones"
                  className="hero-product-img"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,212,255,0.3))' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BRANDS ── */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Trusted Brands</span>
            {['Sony', 'Bose', 'Apple', 'Beats', 'JBL', 'Sennheiser', 'Samsung', 'SteelSeries'].map(brand => (
              <span key={brand} style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '1rem' }}>Browse by Category</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontFamily: 'Orbitron, sans-serif' }}>
              Find Your <span className="gradient-text">Perfect Sound</span>
            </h2>
          </div>
          <div className="grid-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="category-icon">{cat.icon}</span>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.description.substring(0, 35)}...</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="flex flex-between flex-wrap gap-2" style={{ marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>Hand-picked</div>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                Featured <span className="gradient-text">Products</span>
              </h2>
            </div>
            <Link href="/products" className="btn btn-outline">View All →</Link>
          </div>
          <div className="grid-products">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'Free delivery on orders above ₹5,000 across India' },
              { icon: '↩️', title: '10-Day Returns', desc: 'Not satisfied? Return within 10 days hassle-free' },
              { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted payments with multiple gateways' },
              { icon: '🎧', title: 'Expert Support', desc: '24/7 audio expert support for all your queries' },
            ].map(v => (
              <div key={v.title} className="glass neon-border" style={{ padding: '1.75rem', textAlign: 'center', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{v.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.1) 100%)', border: '1px solid var(--border)', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>
            Use code <span className="gradient-text">HACKOVER10</span> for 10% Off
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Limited time hackathon offer — valid on all orders above ₹1,000</p>
          <Link href="/products" className="btn btn-primary btn-lg">Grab the Deal →</Link>
        </div>
      </section>
    </>
  );
}
