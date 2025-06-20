export interface NotificationSender {
  sendToTokens(params: {
    title: string;
    body: string;
    tokens: string[];
    data?: any;
  }): Promise<void>;
}
