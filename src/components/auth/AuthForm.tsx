import React, { useState } from 'react';
import { KeyRound, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthFormProps {
  initialView?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  initialView = 'login',
  onSuccess 
}) => {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Niepoprawny email lub hasło. Spróbuj ponownie.');
          }
          throw signInError;
        }

        onSuccess?.();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        
        if (signUpError) {
          if (signUpError.message === 'User already registered') {
            setError('Ten email jest już zarejestrowany. Zaloguj się.');
            setIsLogin(true);
            return;
          }
          throw signUpError;
        }

        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-2">
          <KeyRound className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight" id="modal-title">
          {isLogin ? 'Witaj ponownie' : 'Utwórz konto'}
        </h2>
        <p className="text-sm text-zinc-400">
          {isLogin
            ? 'Zaloguj się do swojego konta, aby kontynuować'
            : 'Utwórz nowe konto, aby rozpocząć'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-lg text-white placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Wpisz swój email"
              required
              aria-describedby={error ? 'auth-error' : undefined}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-300"
          >
            Hasło
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 rounded-lg text-white placeholder-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Wpisz swoje hasło"
              required
              minLength={6}
              aria-describedby={error ? 'auth-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            id="auth-error"
            role="alert"
            className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg"
          >
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full group flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isLogin ? 'Zaloguj' : 'Zarejestruj'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="w-full text-sm text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-2 py-1"
        >
          {isLogin
            ? 'Nie masz konta? Zarejestruj się'
            : 'Masz już konto? Zaloguj się'}
        </button>
      </form>
    </div>
  );
};