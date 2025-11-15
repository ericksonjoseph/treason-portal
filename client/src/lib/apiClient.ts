import { client } from '@/../../src/api/generated/client.gen';

const getStoredToken = (): string | null => {
  try {
    const storedUser = localStorage.getItem('treason_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.token || null;
    }
  } catch (e) {
    console.error('Error parsing stored user:', e);
  }
  return null;
};

export const configureApiClient = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const token = getStoredToken();
  
  client.setConfig({
    baseUrl,
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  });
};

export { client };
