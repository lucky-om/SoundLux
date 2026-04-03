'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { 
          data: { full_name: form.name },
          emailRedirectTo: 'https://soundlux.luckyverse.tech' 
        },
      });
      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', marginBottom: '0.75rem', color: 'var(--neon-green)' }}>Check Your Email!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          We&apos;ve sent a confirmation link to <strong style={{ color: 'var(--neon-cyan)' }}>{form.email}</strong>.<br />
          Click the link to activate your account.
        </p>
        <Link href="/auth/login" className="btn btn-primary btn-full">Go to Login →</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎧</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', fontWeight: 900 }}>
            Sound<span style={{ color: 'var(--neon-cyan)' }}>Lux</span>
          </div>
        </div>
        <h1 className="auth-title" style={{ textAlign: 'center' }}>Create Account</h1>
        <p className="auth-subtitle" style={{ textAlign: 'center' }}>Join the premium audio experience</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label className="input-label" htmlFor="signup-name">Full Name</label>
            <input id="signup-name" className="input" placeholder="Om Patel" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="signup-email">Email Address</label>
            <input id="signup-email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="signup-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="signup-password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Min 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="signup-confirm">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input id="signup-confirm" type={showPassword ? 'text' : 'password'} className="input" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="signup-submit-btn">
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account? <Link href="/auth/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
