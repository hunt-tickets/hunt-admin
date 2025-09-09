import { NextRequest } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function validateApiSession(request: NextRequest) {
  // Use mock user if development auth mode is enabled
  if (process.env.NEXT_PUBLIC_AUTH_DEV_MODE === 'true') {
    return {
      id: 'dev-user',
      email: 'dev@hunt-tickets.com',
      name: 'Developer User'
    };
  }

  const cookies = request.headers.get('cookie') || '';
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/validate', {
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
    console.error('API auth validation failed:', error);
    return null;
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }), 
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}