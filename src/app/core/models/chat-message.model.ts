export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  ts: number;
}