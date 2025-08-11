// types.ts

// Represents a scheduled Slack message stored in your database
export interface ScheduledMessage {
  id: number;
  channel: string;
  text: string;
  send_at: number;  // Unix timestamp in milliseconds
  sent: number;     // 0 = not sent, 1 = sent
}

// Represents Slack OAuth tokens stored in your app
export interface SlackToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;  // Unix timestamp in milliseconds indicating token expiry
}

// Represents a Slack channel object (simplified)
export interface SlackChannel {
  id: string;
  name: string;
}

// Payload to send a Slack message immediately via POST /slack/send
export interface SendMessageRequest {
  channel: string;
  text: string;
}

// Payload to schedule a Slack message via POST /slack/schedule
export interface ScheduleMessageRequest {
  channel: string;
  text: string;
  send_at: number;  // Unix timestamp in milliseconds to send the message
}
