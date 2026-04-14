const BASE_URL = process.env.NEXT_PUBLIC_PUBLIC_API;
const APP_ID = process.env.NEXT_PUBLIC_PUBLIC_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_PUBLIC_APP_KEY;

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultHeaders = {
    'x-app-id': APP_ID,
    'x-app-key': APP_KEY,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: defaultHeaders,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'API error');
  }

  return res.json();
}
