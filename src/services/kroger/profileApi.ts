import { KrogerProfile } from './types';
import { krogerAuth } from './auth';
import { krogerFetch } from './proxy';

const PROFILE_ENDPOINT = '/v1/identity/profile';

export const krogerProfileApi = {
  getProfile: async (): Promise<KrogerProfile | null> => {
    const token = await krogerAuth.getAccessToken();
    if (!token) return null;

    try {
      const data = await krogerFetch(PROFILE_ENDPOINT, token);
      if (!data?.data) return null;

      return {
        id: data.data.id || '',
        firstName: data.data.firstName || '',
        lastName: data.data.lastName || '',
      };
    } catch {
      return null;
    }
  },
};
