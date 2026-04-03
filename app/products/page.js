'use client';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES, formatPrice } from '@/lib/data';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const brands = useMemo(() => ['all', ...new Set(PRODUCTS.map(p => p.brand))], []);

  const filtered = useMemo(() => {
    let results = [...PRODUCTS];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (selectedCat !== 'all') results = results.filter(p => p.category === selectedCat);
    if (selectedBrand !== 'all') results = results.filter(p => p.brand === selectedBrand);
    switch (sort) {
      case 'price-asc': results.sort((a, b) => a.price - b.price); break;
      case 'price-desc': results.sort((a, b) => b.price - a.price); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      case 'newest': results.sort((a, b) => b.id - a.id); break;
      default: results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return results;
  }, [search, selectedCat, selectedBrand, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>🎧 All Products</div>
          <h1>Shop Premium <span className="gradient-text">Headphones</span></h1>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div style={{ marginTop: '1.5rem', maxWidth: 520, position: 'relative' }}>
            <input
              type="text"
              className="input"
              placeholder="🔍 Search brand, model, or category..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              id="product-search"
            />
          </div>
        </div>
      </div>

      <div className="container section-sm">
        <div className="filters-wrap">
          {/* Sidebar filters */}
          <aside className="filter-panel">
            <div className="filter-section">
              <div className="filter-title">Category</div>
              <button
                className={`filter-chip${selectedCat === 'all' ? ' active' : ''}`}
                onClick={() => { setSelectedCat('all'); setPage(1); }}
              >All</button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.slug}
                  className={`filter-chip${selectedCat === cat.slug ? ' active' : ''}`}
                  onClick={() => { setSelectedCat(cat.slug); setPage(1); }}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            <div className="filter-section">
              <div className="filter-title">Brand</div>
              {brands.map(b => (
                <button
                  key={b}
                  className={`filter-chip${selectedBrand === b ? ' active' : ''}`}
                  onClick={() => { setSelectedBrand(b); setPage(1); }}
                >
                  {b === 'all' ? 'All Brands' : b}
                </button>
              ))}
            </div>
            <div className="filter-section">
              <div className="filter-title">Price Range</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {[
                  ['Under ₹10,000', 'noise-cancelling'],
                  ['₹10K – ₹25K', null],
                  ['₹25K – ₹50K', null],
                  ['Above ₹50K', null],
                ].map(([label]) => (
                  <div key={label} style={{ padding: '0.3rem 0', cursor: 'pointer' }}>{label}</div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div>
            <div className="sort-bar">
              <div className="text-sm text-muted">Showing {paginated.length} of {filtered.length} results</div>
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                id="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {paginated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <div style={{ fontWeight: 600 }}>No products found</div>
                <div className="text-sm" style={{ marginTop: '0.5rem' }}>Try a different search or filter</div>
              </div>
            ) : (
              <div className="grid-products">
                {paginated.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
