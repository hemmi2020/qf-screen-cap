'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { X } from 'lucide-react';

export default function AuthModal({ mode, onClose, onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Signup failed');
          setLoading(false);
          return;
        }

        // Auto login after signup
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        });

        if (result?.error) {
          setError('Signup successful but login failed');
        } else {
          onClose();
          window.location.reload();
        }
      } catch (err) {
        setError('Something went wrong');
      }
    } else {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        onClose();
        window.location.reload();
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[hsl(222_47%_15%)] rounded-2xl p-8 max-w-md w-full relative border border-[hsl(222_47%_25%)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[hsl(215_20%_70%)] hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-[hsl(215_20%_70%)] mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded-lg text-white focus:outline-none focus:border-[hsl(187_92%_55%)]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[hsl(215_20%_70%)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded-lg text-white focus:outline-none focus:border-[hsl(187_92%_55%)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(215_20%_70%)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded-lg text-white focus:outline-none focus:border-[hsl(187_92%_55%)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[hsl(187_92%_55%)] text-white font-medium rounded-lg hover:bg-[hsl(187_92%_60%)] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[hsl(215_20%_70%)]">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={onSwitchMode}
            className="text-[hsl(187_92%_55%)] hover:text-[hsl(187_92%_65%)] font-medium"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {mode === 'signup' && (
          <p className="mt-4 text-center text-xs text-[hsl(215_20%_65%)]">
            Get 3 free trials after signup!
          </p>
        )}
      </div>
    </div>
  );
}
