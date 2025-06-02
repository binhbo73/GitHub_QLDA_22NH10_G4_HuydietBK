import API_BASE_URL from '@/lib/config';

export async function handleLogin(email: string, password: string) {
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
  localStorage.setItem('userId', data.user.id.toString());
  return data;
}

export async function handleLoginWithGoogle(credentialResponse: any) {
  const idToken = credentialResponse.credential || null;
  const accessToken = credentialResponse.access_token || null;
  try {
    const res = await fetch(`${API_BASE_URL}auth/google/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken, access_token: accessToken })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('userId', data.user.id);
      return data;
    } else {
      throw new Error(data.error || 'Google login failed');
    }
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : 'An error occurred during Google login'
    );
  }
}

export async function handleSignup(
  email: string,
  name: string,
  password: string
) {
  const response = await fetch(`${API_BASE_URL}users/`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ email, name, password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }
  localStorage.setItem('userId', data.id.toString());
  return data;
}

export async function handleLogout() {
  localStorage.removeItem('userId');
}
