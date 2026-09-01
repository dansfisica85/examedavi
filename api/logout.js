export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido' });
  }
  response.setHeader('Set-Cookie', 'exam_auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  return response.status(200).json({ ok: true });
}
