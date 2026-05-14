export interface Message {
  id?: number;
  text: string;
  sender?: string;
  senderId?: string;
  createdAt?: string;
  timestamp?: number;
}

export interface UseWebSocketOptions {
  url: string;
  onMessageReceived?: (message: Message) => void;
  autoConnect?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (text: string, senderId?: string) => void;
  error: string | null;
}