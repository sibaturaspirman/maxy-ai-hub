import { apiFetch } from './api';

export async function postStamp(boothId, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return apiFetch('/booth/'+boothId+'/stamp', {
      method: 'POST',
      headers
    });
}
