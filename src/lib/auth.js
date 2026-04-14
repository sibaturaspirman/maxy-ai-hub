import { apiFetch } from './api';

export async function loginSamsung(form, mallId) {
    const body = new URLSearchParams({
      project: 'samsung',
      name: form.name,
      email: form.email,
      phoneNumber: form.phone,
      phoneType: form.phoneType,
      phoneOther: form.phoneModel,
      location: mallId, // <--- ini tambahan barunya
    });
  
    return apiFetch('/auth/login', {
      method: 'POST',
      body,
    });
}
