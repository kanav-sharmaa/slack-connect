import cron from 'node-cron';
import { openDb } from './tokenStore';
import { getTokens } from './tokenStore';
import axios from 'axios';

export async function scheduleMessage(channel: string, text: string, send_at: number) {
    const db = await openDb();
    await db.run('INSERT INTO scheduled_messages (channel, text, send_at, status) VALUES (?, ?, ?, ?)',
        [channel, text, send_at, 'pending']);
    await db.close();
}

export async function listScheduledMessages() {
    const db = await openDb();
    const result = await db.all('SELECT * FROM scheduled_messages WHERE status = "pending"');
    await db.close();
    return result;
}

export async function cancelScheduledMessage(id: number) {
    const db = await openDb();
    await db.run('DELETE FROM scheduled_messages WHERE id = ?', [id]);
    await db.close();
}

export function initScheduler() {
    cron.schedule('* * * * *', async () => {
        try {
            const db = await openDb();
            const now = Date.now();
            const messages = await db.all('SELECT * FROM scheduled_messages WHERE status = "pending" AND send_at <= ?', [now]);

            const tokens = await getTokens();
            if (!tokens) {
                console.log('No tokens found, skipping scheduled message processing');
                await db.close();
                return;
            }

            for (const msg of messages) {
                try {
                    await axios.post('https://slack.com/api/chat.postMessage', {
                        channel: msg.channel,
                        text: msg.text
                    }, {
                        headers: {
                            Authorization: `Bearer ${tokens.access_token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    await db.run('UPDATE scheduled_messages SET status = "sent" WHERE id = ?', [msg.id]);
                    console.log(`Sent scheduled message ${msg.id}`);
                } catch (error) {
                    console.error(`Failed to send scheduled message ${msg.id}:`, error);
                }
            }
            await db.close();
        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });
}
