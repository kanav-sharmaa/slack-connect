import { Router } from 'express';
import axios from 'axios';
import { saveTokens, getTokens } from './tokenStore';
import { scheduleMessage, listScheduledMessages, cancelScheduledMessage } from './scheduler';

const router = Router();

router.get('/slack/connect', (req, res) => {
    const authURL = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=channels:read,groups:read,im:read,mpim:read&redirect_uri=${}
`;
    res.redirect(authURL);
});

router.get('/slack/callback', async (req, res) => {
    const code = req.query.code;
    try {
        const resp = await axios.post('https://slack.com/api/oauth.v2.access', null, {
            params: {
                code,
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                redirect_uri: process.env.SLACK_REDIRECT_URI
            }
        });
        if (resp.data.ok) {
            await saveTokens(resp.data.access_token, resp.data.refresh_token, Date.now() + 3500 * 1000);
            res.send(`
                <html>
                    <body>
                        <h1>Connected to Slack successfully!</h1>
                        <p>You can now close this window and return to the application.</p>
                        <script>
                            setTimeout(() => {
                                window.close();
                            }, 2000);
                        </script>
                    </body>
                </html>
            `);
        } else {
            res.status(400).send(resp.data.error);
        }
    } catch (err: any) {
        res.status(500).send(err.message);
    }
});

router.get('/slack/channels', async (req, res) => {
    try {
        const tokens = await getTokens();
        if (!tokens) {
            return res.status(401).json({ error: 'Not connected to Slack' });
        }

        const resp = await axios.get('https://slack.com/api/conversations.list', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
            params: {
                types: 'public_channel,private_channel'
            }
        });

        if (resp.data.ok) {
            res.json(resp.data.channels);
        } else {
            res.status(400).json({ error: resp.data.error });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/slack/send', async (req, res) => {
    const { channel, text } = req.body;
    try {
        const tokens = await getTokens();
        if (!tokens) {
            return res.status(401).json({ error: 'Not connected to Slack' });
        }

        const resp = await axios.post('https://slack.com/api/chat.postMessage', {
            channel,
            text
        }, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(resp.data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/slack/schedule', async (req, res) => {
    const { channel, text, send_at } = req.body;
    try {
        await scheduleMessage(channel, text, send_at);
        res.json({ success: true, message: 'Message scheduled' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/slack/scheduled', async (req, res) => {
    try {
        const messages = await listScheduledMessages();
        res.json(messages);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/slack/scheduled/:id', async (req, res) => {
    try {
        await cancelScheduledMessage(parseInt(req.params.id));
        res.json({ success: true, message: 'Scheduled message cancelled' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
