import { log } from 'node:console';
import { logMessage } from '../src/logger';

interface PinguiAlertConfig {
  chatId: string | number;
  token: string;
  baseUrl?: string;
}

export class PinguiAlert {
  private chatId: string | number;
  private token: string;
  private baseUrl: string;

  constructor(config: PinguiAlertConfig) {
    this.chatId = config.chatId;
    this.token = config.token;
    this.baseUrl = config.baseUrl || 'https://pingui-alert.dev';
  }

  public async sendAlert(message: string, title?: string): Promise<void> {
    let payload;
    if (title) {
      payload = {
        chatId: this.chatId,
        title: title,
        message: message,
      };
    } else {
      payload = {
        chatId: this.chatId,
        message: message,
      };
    }

    try {
      const res = await fetch(`${this.baseUrl}/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        logMessage(
          `Error sending alert: ${res.status} ${res.statusText}`,
          'error',
        );
        throw new Error(`Error sending alert: ${res.status} ${res.statusText}`);
      }

      console.log('Alert sent successfully');
      logMessage('Alert sent successfully');
    } catch (error) {
      if (error instanceof Error) {
        logMessage(`Error sending alert: ${error.message}`, 'error');
        console.error(`Error sending alert:`, error.message);
      } else {
        logMessage(
          'An unknown error occurred while sending alert. ' +
            JSON.stringify(error),
          'error',
        );
        console.error('Failed to send alert:', error);
      }
    }
  }
}
