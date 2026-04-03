'use client';
import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS, formatPrice } from '@/lib/data';
import { useCart } from '@/lib/store';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const MOCK_REVIEWS = [
  { id: 1, name: 'Khushi Patel', rating: 5, title: 'Absolutely incredible!', body: 'Best purchase of the year. The sound quality is out of this world. Active noise cancellation is top tier — perfect for my daily commute.', date: '2026-03-15' },
  { id: 2, name: 'Lucky Mehta', rating: 4, title: 'Premium quality, worth every rupee', body: 'Build quality is excellent and comfort is amazing even after hours of use. Slight learning curve for the controls but nothing major.', date: '2026-03-08' },
  { id: 3, name: 'Krisha Melwala', rating: 5, title: 'Game changer for music lovers', body: 'I can literally hear details in songs I have never noticed before. The bass is punchy without being overwhelming. Highly recommend!', date: '2026-02-22' },
];

function StarRating({ rating, size = 'sm' }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`star${i > Math.round(rating) ? '-empty' : ''}`}
          style={{ fontSize: size === 'lg' ? '1.2rem' : '0.85rem' }}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = PRODUCTS.find(p => p.id === parseInt(id));
  if (!product) notFound();

  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (!reviewText || !userRating) return;
    setReviews(prev => [{
      id: Date.now(), name: 'You', rating: userRating,
      title: reviewTitle || 'My Review', body: reviewText, date: new Date().toISOString().slice(0, 10),
    }, ...prev]);
    setReviewText(''); setReviewTitle(''); setUserRating(0);
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</Link>
          <span>/</span>
          <span style={{ color: 'var(--neon-cyan)' }}>{product.brand} {product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img src={product.images[selectedImg] || product.image} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <div key={i} className={`gallery-thumb${selectedImg === i ? ' active' : ''}`} onClick={() => setSelectedImg(i)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="product-detail-brand">{product.brand}</div>
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-tagline">{product.tagline}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <StarRating rating={product.rating} size="lg" />
              <span style={{ color: 'var(--neon-amber)', fontWeight: 700 }}>{product.rating}</span>
              <span className="text-muted text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="product-detail-price">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="product-detail-price-main gradient-text">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount && <span className="badge badge-green">-{discount}% OFF</span>}
              </div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Inclusive of all taxes • Free shipping on this order
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="input-label" style={{ marginBottom: '0.5rem' }}>Quantity</div>
              <div className="qty-control">
                <button className="qty-btn" style={{ width: 36, height: 36 }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num" style={{ minWidth: 40, fontSize: '1rem' }}>{qty}</span>
                <button className="qty-btn" style={{ width: 36, height: 36 }} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                <span className="text-sm text-muted" style={{ marginLeft: '0.75rem' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : '⚠️ Out of stock'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-lg ${added ? 'btn-ghost' : 'btn-primary'}`}
                style={{ flex: 1 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                id={`add-to-cart-detail-${product.id}`}
              >
                {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <Link href="/checkout" className="btn btn-outline btn-lg"
                onClick={() => addToCart(product, qty)}
                style={{ flex: 1, textAlign: 'center' }}
              >
                ⚡ Buy Now
              </Link>
            </div>

            {/* Specs */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📋 Specifications
              </h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Description */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>About this product</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '4rem' }}>
          <div className="divider" />
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', marginBottom: '2rem' }}>
            Customer <span className="gradient-text">Reviews</span>
          </h2>

          {/* Write review */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>Write a Review</h3>
            <form onSubmit={handleReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div className="input-label">Your Rating</div>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.4rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button"
                      onClick={() => setUserRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: s <= userRating ? 'var(--neon-amber)' : 'var(--text-muted)' }}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Review Title</label>
                <input className="input" placeholder="Summarize your experience" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Your Review</label>
                <textarea className="input" rows={4} placeholder="Share your honest thoughts..." value={reviewText} onChange={e => setReviewText(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Review</button>
            </form>
          </div>

          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="reviewer-name">{r.name}</div>
                      <div className="review-date">{r.date}</div>
                    </div>
                  </div>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <div className="review-title">{r.title}</div>
              <div className="review-body">{r.body}</div>
            </div>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div className="divider" />
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', marginBottom: '2rem' }}>
              Related <span className="gradient-text">Products</span>
            </h2>
            <div className="grid-products">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
