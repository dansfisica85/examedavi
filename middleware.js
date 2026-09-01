import { next } from '@vercel/functions';

const AUTH_COOKIE = 'exam_auth';
const AUTH_TOKEN = '5b2181637f679197a8a3c9fd649c44493b44bd0ab4720950f90f9bc31c9f1eaf';
const PUBLIC_PATHS = new Set(['/login', '/login.html', '/api/login', '/api/logout']);

function readCookie(header, name) {
  const prefix = `${name}=`;
  for (const part of String(header || '').split(';')) {
    const value = part.trim();
    if (value.startsWith(prefix)) return decodeURIComponent(value.slice(prefix.length));
  }
  return '';
}

export default function middleware(request) {
  const url = new URL(request.url);

  if (PUBLIC_PATHS.has(url.pathname) || url.pathname.startsWith('/_vercel/')) {
    return next({ headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  }

  const token = readCookie(request.headers.get('cookie'), AUTH_COOKIE);
  if (token === AUTH_TOKEN) {
    return next({ headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  }

  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }

  const login = new URL('/login', request.url);
  login.searchParams.set('next', `${url.pathname}${url.search}`);
  return Response.redirect(login, 303);
}
