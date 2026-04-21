export interface WsChatMessage {
  type: 'chat' | 'notification' | 'status' | 'ping' | 'pong';
  payload: {
    text?: string;
    textKey?: string;
    lang?: 'es' | 'en' | 'fr';
  };
  from: 'user' | 'bot' | 'system';
  timestamp: string;
}