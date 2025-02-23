import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Password validation
  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err) {
      let errorMessage = 'An error occurred';
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('invalid_credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'This email is already registered';
        } else if (err.message.includes('Username is required')) {
          errorMessage = 'Please enter a username';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-4">
        <div className="relative bg-background-secondary rounded-xl border border-accent-metallic-dark/10 shadow-xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-accent-metallic hover:text-accent-metallic-light transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-accent-metallic-light mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-accent-metallic mb-6">
              {mode === 'signin'
                ? 'Sign in to continue your learning journey'
                : 'Join our community of AI learners'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-accent-metallic mb-1"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-metallic-dark" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className={cn(
                        'w-full pl-10 pr-4 py-2 rounded-lg',
                        'bg-background/50 border border-accent-metallic-dark/20',
                        'text-accent-metallic-light placeholder-accent-metallic-dark',
                        'focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple/30'
                      )}
                      placeholder="Choose a username"
                      required
                      minLength={3}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-accent-metallic mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-metallic-dark" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg',
                      'bg-background/50 border border-accent-metallic-dark/20',
                      'text-accent-metallic-light placeholder-accent-metallic-dark',
                      'focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple/30'
                    )}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-accent-metallic mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-metallic-dark" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg',
                      'bg-background/50 border border-accent-metallic-dark/20',
                      'text-accent-metallic-light placeholder-accent-metallic-dark',
                      'focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple/30'
                    )}
                    placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                    required
                    minLength={6}
                  />
                </div>
                {mode === 'signup' && (
                  <p className="mt-1 text-xs text-accent-metallic">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-2 rounded-lg',
                  'bg-accent-purple text-white',
                  'hover:bg-accent-purple-dark',
                  'transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-accent-purple/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center'
                )}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-accent-metallic">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => onModeChange('signup')}
                    className="text-accent-purple-light hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => onModeChange('signin')}
                    className="text-accent-purple-light hover:underline"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
