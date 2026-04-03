'use client';
import { useState } from 'react';
import { PRODUCTS, CATEGORIES, formatPrice } from '@/lib/data';

const INITIAL_FORM = { name: '', brand: '', price: '', originalPrice: '', category: 'wireless', image: '', description: '', stock: '', badge: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([...PRODUCTS]);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(INITIAL_FORM); setModal('add'); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, brand: p.brand, price: p.price, originalPrice: p.originalPrice || '', category: p.category, image: p.image, description: p.description, stock: p.stock, badge: p.badge || '' });
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditProduct(null); };

  const handleSave = () => {
    if (!form.name || !form.brand || !form.price) return;
    if (modal === 'add') {
      const newProduct = { ...INITIAL_FORM, ...form, id: Date.now(), price: +form.price, originalPrice: +form.originalPrice || null, stock: +form.stock || 0, rating: 4.5, reviewCount: 0, isFeatured: false, images: [form.image], specs: {} };
      setProducts(prev => [newProduct, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...form, price: +form.price, originalPrice: +form.originalPrice || null, stock: +form.stock || 0 } : p));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem' }}>Manage <span className="gradient-text">Products</span></h1>
          <p className="text-muted text-sm">{products.length} products total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-product-btn">+ Add Product</button>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <input className="input" style={{ maxWidth: 380 }} placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,212,255,0.03)' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.9rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={p.image} alt="" style={{ width: 48, height: 48, objectFit: 'contain', background: 'var(--bg-secondary)', borderRadius: 8, padding: '0.3rem' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.brand} {p.name}</div>
                      {p.badge && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{p.badge}</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span className="badge badge-purple" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>{p.category}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--neon-cyan)', fontSize: '0.875rem' }}>{formatPrice(p.price)}</td>
                <td style={{ padding: '0.9rem 1rem', fontSize: '0.875rem' }}>
                  <span style={{ color: p.stock > 10 ? 'var(--neon-green)' : p.stock > 0 ? 'var(--neon-amber)' : '#ef4444' }}>
                    {p.stock > 0 ? `${p.stock} units` : 'Out of stock'}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 1rem', fontSize: '0.875rem' }}>⭐ {p.rating}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem' }}>{modal === 'add' ? '+ Add Product' : '✏️ Edit Product'}</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }} onClick={closeModal}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="input-group"><label className="input-label">Brand *</label><input className="input" placeholder="Sony" value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} /></div>
                <div className="input-group"><label className="input-label">Model Name *</label><input className="input" placeholder="WH-1000XM5" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
              </div>
              <div className="form-row">
                <div className="input-group"><label className="input-label">Price (₹) *</label><input className="input" type="number" placeholder="29990" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} /></div>
                <div className="input-group"><label className="input-label">Original Price (₹)</label><input className="input" type="number" placeholder="34990" value={form.originalPrice} onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))} /></div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                    {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div className="input-group"><label className="input-label">Stock</label><input className="input" type="number" placeholder="50" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} /></div>
              </div>
              <div className="input-group"><label className="input-label">Image URL</label><input className="input" placeholder="https://..." value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} /></div>
              <div className="input-group"><label className="input-label">Badge</label><input className="input" placeholder="Best Seller" value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))} /></div>
              <div className="input-group"><label className="input-label">Description</label><textarea className="input" rows={3} placeholder="Product description..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} style={{ resize: 'vertical' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ flex: 2 }}>{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
