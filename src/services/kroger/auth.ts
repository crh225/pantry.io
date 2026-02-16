import { KrogerConfig } from './types';

let cachedToken: { token: string; expires: number } | null = null;

export const getToken = async (config: KrogerConfig): Promise<string> => {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;

  const creds = btoa(`${config.clientId}:${config.clientSecret}`);
  const res = await fetch('https://api-ce.kroger.com/v1/connect/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${creds}`,
    },
    body: 'grant_type=client_credentials&scope=product.compact',
  });

  if (!res.ok) throw new Error(`Kroger auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
};
