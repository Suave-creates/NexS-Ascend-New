'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface SessionUser {
  employeeCode: string;
  accountType: 'OPERATOR' | 'SUPER_ADMIN';
}

interface LoginResult {
  ok: boolean;
  error?: string;
  message?: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (employeeCode: string, password: string) => Promise<LoginResult>;
  adminLogin: (employeeCode: string, password: string) => Promise<LoginResult>;
  signup: (employeeCode: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

// The session token lives in memory only — never localStorage, sessionStorage,
// or a cookie — so it's invisible to any injected script (best XSS/DAST
// posture) and a hard page refresh always requires re-login. That tradeoff
// was chosen deliberately over cookie-based persistence.
let currentToken: string | null = null;

export function getToken(): string | null {
  return currentToken;
}

function setToken(token: string | null) {
  currentToken = token;
}

const AUTH_ERROR_CODES = new Set(['SESSION_EXPIRED', 'INVALID_TOKEN', 'NO_TOKEN']);

// Drop-in replacement for fetch() on authenticated calls: attaches the
// bearer token, picks up the server's sliding-expiry refresh, and bounces to
// /login the moment the server says the session is gone.
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (currentToken) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  const response = await fetch(input, { ...init, headers });

  const refreshedToken = response.headers.get('X-Auth-Token');
  if (refreshedToken) {
    setToken(refreshedToken);
  }

  if (response.status === 401) {
    const body = await response
      .clone()
      .json()
      .catch(() => null);
    if (body?.code && AUTH_ERROR_CODES.has(body.code)) {
      const wasAdminPath = typeof window !== 'undefined'
        && window.location.pathname.startsWith('/super-admin');
      setToken(null);
      if (typeof window !== 'undefined') {
        const loginPath = wasAdminPath ? '/super-admin/login' : '/login';
        if (window.location.pathname !== loginPath) window.location.assign(loginPath);
      }
    }
  }

  return response;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = new Set(['/login', '/signup', '/super-admin/login']);

async function credentialPost(url: string, employeeCode: string, password: string): Promise<LoginResult & { token?: string; user?: SessionUser }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeCode, password }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { ok: false, error: data.error || 'Request failed' };
  }
  return { ok: true, token: data.token, user: data.user, message: data.message };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const login = useCallback(async (employeeCode: string, password: string): Promise<LoginResult> => {
    const result = await credentialPost('/api/auth', employeeCode, password);
    if (!result.ok) return { ok: false, error: result.error };
    setToken(result.token!);
    setUser(result.user!);
    return { ok: true };
  }, []);

  const adminLogin = useCallback(async (employeeCode: string, password: string): Promise<LoginResult> => {
    const result = await credentialPost('/api/super-admin/auth', employeeCode, password);
    if (!result.ok) return { ok: false, error: result.error };
    setToken(result.token!);
    setUser(result.user!);
    return { ok: true };
  }, []);

  const signup = useCallback(async (employeeCode: string, password: string): Promise<LoginResult> => {
    const result = await credentialPost('/api/auth/signup', employeeCode, password);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, message: result.message };
  }, []);

  const logout = useCallback(() => {
    const destination = user?.accountType === 'SUPER_ADMIN' ? '/super-admin/login' : '/login';
    setToken(null);
    setUser(null);
    router.push(destination);
  }, [router, user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isReady, login, adminLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

// Gates the page content specifically (not the app chrome around it) behind
// login. Split out from AuthProvider so Sidebar/Header can always render —
// otherwise the whole shell blanks out on every load until the client
// hydrates and redirects, instead of just the page area.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPath = PUBLIC_PATHS.has(pathname);
  const isAdminPath = pathname.startsWith('/super-admin/') && pathname !== '/super-admin/login';
  const hasAccess = isAdminPath ? user?.accountType === 'SUPER_ADMIN' : isAuthenticated;

  useEffect(() => {
    if (isReady && !hasAccess && !isPublicPath) {
      router.replace(isAdminPath ? '/super-admin/login' : '/login');
    }
  }, [isReady, hasAccess, isPublicPath, isAdminPath, router]);

  if (!isPublicPath && !hasAccess) return null;
  return <>{children}</>;
}
