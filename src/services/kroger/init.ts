import { kroger } from './index';

const CLIENT_ID = 'pantry-io-bbcck99z';
const CLIENT_SECRET = '5U6iqfC1Gu4lURPBdbrktNJ4vr0POmcy5VFcUvfG';

export const initKroger = () => {
  kroger.configure({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
};
