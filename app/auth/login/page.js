'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      router.push('/');
    } catch (err) {
      setError(err?.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  // Demo login
  const demoLogin = async () => {
    setLoading(true); setError('');
    // Simulate login for demo purposes
    localStorage.setItem('demo_user', JSON.stringify({ email: 'demo@soundlux.com', name: 'Demo User' }));
    router.push('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎧</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', fontWeight: 900 }}>
            Sound<span style={{ color: 'var(--neon-cyan)' }}>Lux</span>
          </div>
        </div>
        <h1 className="auth-title" style={{ textAlign: 'center' }}>Welcome Back</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>Sign in to your account</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="login-password">Password</label>
            <input id="login-password" type="password" className="input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="login-submit-btn">
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '1.25rem 0' }}>— or —</div>

        <button className="btn btn-ghost btn-full" onClick={demoLogin} id="demo-login-btn">
          🎧 Continue as Demo User
        </button>

        <p className="auth-link-text">
          Don't have an account? <Link href="/auth/signup">Sign up free →</Link>
        </p>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,212,255,0.05)', borderRadius: 8, border: '1px solid rgba(0,212,255,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          🔒 Secured by Supabase Auth. For admin access, set role='admin' in profiles table.
        </div>
      </div>
    </div>
  );
}
