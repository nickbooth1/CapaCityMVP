import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check auth status
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Middleware Check:', { path: req.nextUrl.pathname, hasSession: !!session });
  
  // If there's no session and the user is trying to access a protected route
  const path = req.nextUrl.pathname;
  const isAuthRoute = path === '/login' || path === '/signup';
  
  if (!session && !isAuthRoute) {
    // Redirect to login if trying to access a protected route
    console.log('Middleware: No session, redirecting to /login');
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // If they're logged in and trying to access login/signup, redirect to homepage
  if (session && isAuthRoute) {
    console.log('Middleware: Has session, redirecting from auth route to /');
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  console.log('Middleware: Allowing request');
  return res;
}

// Apply this middleware to all routes except public assets and API routes
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.png$).*)'],
}; 