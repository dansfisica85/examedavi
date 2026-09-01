import { scryptSync, timingSafeEqual } from 'node:crypto';

const SALT = Buffer.from('d7cafefd4bcb71a1a70314d710eac069', 'hex');
const EXPECTED = Buffer.from('7fa43b14e3b21f7cf7c0cb46fd82d8151b876399d63e5b5a227f8dee5b0b7a0f', 'hex');
const AUTH_TOKEN = '5b2181637f679197a8a3c9fd649c44493b44bd0ab4720950f90f9bc31c9f1eaf';

async function readBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') {
    try { return JSON.parse(request.body); } catch { return {}; }
  }
  let raw = '';
  try {
    for await (const chunk of request) raw += chunk;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const body = await readBody(request);
  const password = String(body?.password ?? '');
  let candidate;
  try {
    candidate = scryptSync(password, SALT, 32, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  } catch {
    return response.status(401).json({ error: 'Senha incorreta' });
  }

  const valid = candidate.length === EXPECTED.length && timingSafeEqual(candidate, EXPECTED);
  if (!valid) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return response.status(401).json({ error: 'Senha incorreta' });
  }

  response.setHeader('Set-Cookie', `exam_auth=${AUTH_TOKEN}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`);
  return response.status(200).json({ ok: true });
}
