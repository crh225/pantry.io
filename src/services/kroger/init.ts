import { kroger } from './index';

export const initKroger = () => {
  const clientId = process.env.REACT_APP_KROGER_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_KROGER_CLIENT_SECRET;
  if (clientId && clientSecret) {
    kroger.configure({ clientId, clientSecret });
  }
};
