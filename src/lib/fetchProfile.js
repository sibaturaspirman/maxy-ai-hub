// src/lib/fetchProfile.js
import { apiFetch } from './api';

export async function fetchProfile(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return apiFetch('/auth/profile', {
    method: 'GET',
    headers,
  });
}
