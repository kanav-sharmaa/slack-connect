import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { initScheduler } from './scheduler';
import { initDatabase } from './tokenStore';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

const PORT = parseInt(process.env.PORT || '4000', 10);

async function startServer() {
    try {
        await initDatabase();
        console.log('Database initialized successfully');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Backend running on port ${PORT}`);
            initScheduler();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
