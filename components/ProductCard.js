'use client';
import Link from 'next/link';
import { useCart } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import { useState } from 'react';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i > Math.round(rating) ? '-empty' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badgeClass = {
    'Best Seller': 'badge-cyan',
    'Top Rated': 'badge-amber',
    'Premium': 'badge-purple',
    'Gaming Pro': 'badge-green',
    'Studio Classic': 'badge-amber',
    'Audiophile': 'badge-purple',
    'Best Earbuds': 'badge-pink',
    'Best Value': 'badge-green',
    'Pro Choice': 'badge-cyan',
  }[product.badge] || 'badge-cyan';

  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-img-wrap">
          <img src={product.image} alt={`${product.brand} ${product.name}`} loading="lazy" />
          {product.badge && (
            <div className="product-card-badge">
              <span className={`badge ${badgeClass}`}>{product.badge}</span>
            </div>
          )}
          <button
            className={`product-card-wish${liked ? ' liked' : ''}`}
            onClick={e => { e.preventDefault(); setLiked(!liked); }}
            title="Wishlist"
          >
            {liked ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="product-card-body">
          <div className="product-brand">{product.brand}</div>
          <div className="product-name">{product.name}</div>
          <div className="product-rating">
            <StarRating rating={product.rating} />
            <span className="product-rating-score">{product.rating} ({product.reviewCount.toLocaleString()})</span>
          </div>
          <div className="product-price">
            <span className="product-price-main">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
                {discount && <span className="product-price-off">-{discount}%</span>}
              </>
            )}
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <button
          className={`btn btn-full btn-sm ${added ? 'btn-ghost' : 'btn-primary'}`}
          onClick={handleAdd}
          id={`add-cart-${product.id}`}
        >
          {added ? '✅ Added!' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}
