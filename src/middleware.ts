import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_SERVER = 'https://hunt-auth-v3.onrender.com';
const isDevelopment = process.env.NODE_ENV === 'development';
const useDevAuth = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true';

async function validateSession(cookies: string) {
  // Use mock user if development auth mode is enabled
  if (useDevAuth) {
    return {
      id: 'dev-user',
      email: 'dev@hunt-tickets.com',
      name: 'Developer User'
    };
  }

  try {
    const response = await fetch(`${AUTH_SERVER}/api/auth/validate`, {
      method: 'GET',
      headers: {
        'Cookie': cookies,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.authenticated ? data.user : null;
  } catch (error) {
    console.error('Auth validation failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip auth check for public assets and API routes that don't need auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/test-db') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  const cookies = request.headers.get('cookie') || '';
  const user = await validateSession(cookies);
  
  if (!user) {
    // Redirect to auth server for login
    return NextResponse.redirect(`${AUTH_SERVER}/sign-in?redirect=${encodeURIComponent(request.url)}`);
  }
  
  // User is authenticated, continue
  const response = NextResponse.next();
  
  // Add user info to headers for use in components
  if (user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);
    response.headers.set('x-user-name', user.name);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};