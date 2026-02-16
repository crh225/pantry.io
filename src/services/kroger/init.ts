import { kroger } from './index';

export const initKroger = () => {
  kroger.configure({ clientId: 'proxy', clientSecret: 'proxy' });
};
