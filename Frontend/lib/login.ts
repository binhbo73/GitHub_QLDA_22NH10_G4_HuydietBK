import API_BASE_URL from '@/lib/config';

export default async function handleLogin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}
