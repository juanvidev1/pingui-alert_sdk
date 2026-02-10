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
      const res = await fetch(`${this.baseUrl}/api/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Error sending alert: ${res.status} ${res.statusText}`);
      }

      console.log('Alert sent successfully');
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error sending alert:`, error.message);
      } else {
        console.error('Failed to send alert:', error);
      }
    }
  }

  public async validateStatus(): Promise<any> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/integrations/${this.chatId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error(
          `Error fetching quota: ${res.status} ${res.statusText}`,
        );
      }

      const data = (await res.json()) as any;

      const alertsQuota = data.integrations.rateLimit;
      const activeIntegration = data.integrations.status;

      if (!activeIntegration || activeIntegration !== 'active') {
        console.warn(
          'Warning: Your integration is inactive. Please check your chat ID and token.',
        );
        return {
          remainingAlerts: 'N/A',
          status: activeIntegration,
          success: false,
        };
      }

      if (alertsQuota && alertsQuota === 0) {
        console.warn(
          'Warning: You have reached your daily alerts quota limit.',
        );
        return {
          remainingAlerts: 0,
          success: false,
        };
      }

      return {
        remainingAlerts: alertsQuota,
        success: true, // Assuming you want to consider the fetch successful if no error is thrown
      };
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
    }
  }
}
