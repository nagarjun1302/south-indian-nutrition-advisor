import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const signedUpEmail = email.trim();

        const { data, error } = await supabase.auth.signUp({
          email: signedUpEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        setEmail(signedUpEmail);
        setPassword('');
        setIsSignUp(false);
        setInfoMsg("Your account has been created. Please check your email and verify your address before logging in.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data?.session && data?.user) {
          if (onAuthSuccess) {
            onAuthSuccess(data.session, data.user);
          }
          onClose();
        } else {
          throw new Error("No active session returned. Please check your credentials.");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '28px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>
              {isSignUp ? 'Create your Account' : 'Welcome back'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {isSignUp ? 'Start tracking your daily South Indian meals' : 'Sign in to access your personalized dashboard'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {infoMsg && !isSignUp && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'var(--accent-green-light)',
              border: '1px solid var(--accent-green-border)',
              color: 'var(--accent-green)',
              fontSize: '12px',
              lineHeight: 1.5,
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  style={{ paddingLeft: '40px' }}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            <Sparkles size={16} />
            <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>

          {errorMsg && (
            <p style={{ color: 'var(--accent-red)', fontSize: '12px', marginTop: '4px', textAlign: 'center', fontWeight: '600' }}>
              {errorMsg}
            </p>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
              setInfoMsg('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', fontWeight: '700', cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
};
