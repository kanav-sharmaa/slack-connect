import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
    return open({
        filename: process.env.DATABASE_PATH || 'slack.db',
        driver: sqlite3.Database
    });
}

export async function initDatabase() {
    const db = await openDb();
    
    // Create tokens table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            access_token TEXT,
            refresh_token TEXT,
            expires_at INTEGER
        )
    `);
    
    // Create scheduled_messages table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS scheduled_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel TEXT,
            text TEXT,
            send_at INTEGER,
            status TEXT DEFAULT 'pending'
        )
    `);
    
    await db.close();
}

export async function saveTokens(access_token: string, refresh_token: string, expires_at: number) {
    const db = await openDb();
    await db.run('DELETE FROM tokens');
    await db.run('INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES (?, ?, ?)',
        [access_token, refresh_token, expires_at]);
    await db.close();
}

export async function getTokens() {
    const db = await openDb();
    const result = await db.get('SELECT * FROM tokens LIMIT 1');
    await db.close();
    return result;
}
