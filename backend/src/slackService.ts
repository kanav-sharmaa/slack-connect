import axios from 'axios';
import { getTokens, saveTokens } from './tokenStore';

export async function refreshAccessToken() {
    const tokens = await getTokens();
    if (!tokens.refresh_token) return;

    const resp = await axios.post('https://slack.com/api/oauth.v2.access', null, {
        params: {
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET
        }
    });

    if (resp.data.ok) {
        await saveTokens(resp.data.access_token, resp.data.refresh_token, Date.now() + 3500 * 1000);
    }
}
