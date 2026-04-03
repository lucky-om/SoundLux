'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authMode, setAuthMode] = useState('email'); // 'email' | 'phone'
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const handleEmailLogin = async (e) => {
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

  const handlePhoneRequest = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMsg('');
    try {
      const { error: err } = await supabase.auth.signInWithOtp({ phone });
      if (err) throw err;
      setStep('verify');
      setMsg('OTP sent to your phone! Please enter it below.');
    } catch (err) {
      setError(err?.message || "Could not send OTP. Ensure phone auth is enabled in Supabase.");
    }
    setLoading(false);
  };

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { error: err } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (err) throw err;
      router.push('/');
    } catch (err) {
      setError(err?.message || "Invalid or expired OTP.");
    }
    setLoading(false);
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

        {msg && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', color: 'var(--neon-green)', fontSize: '0.875rem' }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <button className={`btn ${authMode === 'email' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => { setAuthMode('email'); setError(''); setMsg(''); }}>Email</button>
          <button className={`btn ${authMode === 'phone' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => { setAuthMode('phone'); setError(''); setMsg(''); setStep('request'); }}>Mobile No</button>
        </div>

        {authMode === 'email' && (
          <form className="auth-form" onSubmit={handleEmailLogin}>
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
        )}

        {authMode === 'phone' && step === 'request' && (
          <form className="auth-form" onSubmit={handlePhoneRequest}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-phone">Mobile Number (with country code)</label>
              <input id="login-phone" type="tel" className="input" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '⏳ Sending OTP...' : '📱 Send OTP'}
            </button>
          </form>
        )}

        {authMode === 'phone' && step === 'verify' && (
          <form className="auth-form" onSubmit={handlePhoneVerify}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-otp">Enter OTP</label>
              <input id="login-otp" type="text" className="input" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? '⏳ Verifying...' : '✅ Verify & Login'}
            </button>
          </form>
        )}



        <p className="auth-link-text">
          Don&apos;t have an account? <Link href="/auth/signup">Sign up free →</Link>
        </p>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,212,255,0.05)', borderRadius: 8, border: '1px solid rgba(0,212,255,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          🔒 Secured by Supabase Auth. For admin access, set role=&apos;admin&apos; in profiles table.
        </div>
      </div>
    </div>
  );
}
