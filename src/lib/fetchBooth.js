// src/lib/fetchBooth.js
import { apiFetch } from './api';

export async function fetchBooth(token) {
  return apiFetch('/booth', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
