'use client';
import { useCart } from '@/lib/store';
import { PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useMemo } from 'react';

export default function WishlistPage() {
  const { wishlist, user, loading } = useCart();

  const wishlistedProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return [];
    return PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  if (loading) {
    return (
      <div className="container section text-center">
        <h2>Loading your wishlist...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container section text-center">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💔</div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif' }}>Please Log In</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>You need an account to view and save your favorite items.</p>
        <Link href="/auth/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-header text-center">
        <div className="container">
          <div className="badge badge-pink" style={{ marginBottom: '1rem' }}>Your Favorites</div>
          <h1>My <span className="gradient-text">Wishlist</span></h1>
          <p className="text-muted" style={{ marginTop: '0.75rem' }}>{wishlistedProducts.length} items saved</p>
        </div>
      </div>

      <div className="container section-sm">
        {wishlistedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '1rem' }}>🤍</div>
            <h3>Your wishlist is empty</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Start exploring and add some premium audio gear to your favorites!</p>
            <Link href="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid-products">
            {wishlistedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
