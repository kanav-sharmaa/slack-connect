# Slack Connect - Setup Instructions

## Overview
This is a fixed version of the Slack Connect application that allows users to connect their Slack workspace, send messages immediately, and schedule messages for future delivery.

## Issues Fixed
- ✅ Database initialization on startup
- ✅ Missing environment variables configuration
- ✅ Server binding to 0.0.0.0 for external access
- ✅ TypeScript compilation errors
- ✅ SQLite3 native module compatibility
- ✅ Proper error handling throughout the application
- ✅ Database connection management
- ✅ Channel fetching from Slack API
- ✅ Frontend error handling and connection checking

## Prerequisites
- Node.js (v18 or higher)
- npm
- A Slack app with OAuth credentials (for full functionality)

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Environment Configuration
The `.env` file is already configured with example values:
```
SLACK_CLIENT_ID=9355432661712.9331055493522
SLACK_CLIENT_SECRET=c082b76224c08b12dbbb5e289950b1fc
SLACK_REDIRECT_URI=http://localhost:4000/slack/callback
PORT=4000
DATABASE_PATH=slack.db
```

**Note:** For production use, you'll need to:
- Create your own Slack app at https://api.slack.com/apps
- Replace the CLIENT_ID and CLIENT_SECRET with your app's credentials
- Update the REDIRECT_URI to match your app's settings

### 3. Build and Start Backend
```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

The backend will:
- Initialize the SQLite database automatically
- Start listening on port 4000
- Begin the message scheduler (runs every minute)

### 4. Frontend Setup
```bash
cd ../frontend
python3 -m http.server 3000
```

Or use any static file server of your choice.

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Application Features

### Working Features (Without Slack OAuth)
- ✅ User interface loads properly
- ✅ Message composition and validation
- ✅ Scheduling interface with date/time picker
- ✅ Scheduled message storage in database
- ✅ Message scheduling validation (future dates only)
- ✅ Fallback channel list when not connected to Slack
- ✅ Error handling and user feedback

### Features Requiring Slack OAuth
- 🔐 Slack workspace connection
- 🔐 Real channel list from Slack API
- 🔐 Actual message sending to Slack
- 🔐 Scheduled message delivery to Slack

## Development Commands

### Backend
```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests (if implemented)
npm test
```

### Database
The SQLite database (`slack.db`) is automatically created with the following tables:
- `tokens`: Stores Slack OAuth tokens
- `scheduled_messages`: Stores scheduled messages

## API Endpoints

### Authentication
- `GET /slack/connect` - Initiates Slack OAuth flow
- `GET /slack/callback` - Handles OAuth callback

### Channels
- `GET /slack/channels` - Fetches available Slack channels

### Messages
- `POST /slack/send` - Sends immediate message
- `POST /slack/schedule` - Schedules a message
- `GET /slack/scheduled` - Lists scheduled messages
- `DELETE /slack/scheduled/:id` - Cancels a scheduled message

## Architecture

### Backend (Node.js + TypeScript)
- **Express.js** - Web framework
- **SQLite** - Database for tokens and scheduled messages
- **node-cron** - Scheduled task execution
- **axios** - HTTP client for Slack API calls

### Frontend (Vanilla JavaScript)
- **HTML/CSS/JS** - Simple, dependency-free frontend
- **Responsive design** - Works on desktop and mobile
- **Real-time feedback** - Status messages and error handling

### Key Components
1. **Token Management** (`tokenStore.ts`) - Handles OAuth token storage and retrieval
2. **Scheduler** (`scheduler.ts`) - Manages scheduled message execution
3. **Routes** (`routes.ts`) - API endpoints and Slack integration
4. **Frontend** (`app.js`) - User interface and API communication

## Security Considerations
- Environment variables for sensitive data
- Input validation on both frontend and backend
- Proper error handling without exposing internal details
- Database connection management

## Deployment Notes
- Server binds to `0.0.0.0` for external access
- CORS enabled for frontend-backend communication
- Database automatically initializes on first run
- Graceful error handling for missing dependencies

## Troubleshooting

### Common Issues
1. **SQLite3 build errors**: Run `npm rebuild sqlite3` after installing build tools
2. **Port conflicts**: Change PORT in `.env` file
3. **CORS errors**: Ensure backend is running and accessible
4. **Slack API errors**: Verify OAuth credentials and app permissions

### Logs
- Backend logs are printed to console
- Check browser console for frontend errors
- Database operations are logged with timestamps

## Next Steps for Production
1. Set up proper Slack app with OAuth credentials
2. Implement token refresh logic
3. Add user authentication and multi-tenant support
4. Deploy to cloud platform (Heroku, AWS, etc.)
5. Set up monitoring and logging
6. Add comprehensive testing suite

