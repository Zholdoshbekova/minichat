export interface Message {
  senderId: string;
  text: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessageReceived?: (message: Message) => void;
  autoConnect?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (text: string, senderId: string) => void;
  error: string | null;
}