'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { CATEGORIES, PRODUCTS, getProductsByCategory } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const category = CATEGORIES.find(c => c.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);

  return (
    <>
      {/* Hero banner */}
      <div style={{
        padding: '5rem 0 3rem',
        background: `radial-gradient(ellipse at 30% 50%, ${category.color}15 0%, transparent 60%), var(--bg-primary)`,
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div className="badge" style={{ background: `${category.color}20`, color: category.color, border: `1px solid ${category.color}40`, marginBottom: '1rem' }}>
            {category.icon} {category.name}
          </div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.75rem' }}>
            {category.name} <span style={{ background: `linear-gradient(135deg, ${category.color}, var(--neon-purple))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Headphones</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>{category.description}</p>
          <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {products.length} products available
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '0.75rem 0', overflow: 'auto' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`filter-chip${cat.slug === slug ? ' active' : ''}`}
                style={cat.slug === slug ? { '--cat-color': category.color, borderColor: category.color, color: category.color } : {}}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container section-sm">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
            <div style={{ fontWeight: 600 }}>No products in this category yet</div>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Browse All Products</Link>
          </div>
        ) : (
          <div className="grid-products">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
