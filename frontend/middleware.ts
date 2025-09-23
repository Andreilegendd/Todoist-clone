import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const publicPaths = ['/auth/login', '/auth/register', '/'];
  
  const privatePaths = ['/app'];
  
  const isPublicPath = publicPaths.includes(path);
  const isPrivatePath = privatePaths.some(privatePath => path.startsWith(privatePath));

  if (isPrivatePath && !request.cookies.get('session')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};