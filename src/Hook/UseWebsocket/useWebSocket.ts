import { useEffect, useRef, useState, useCallback } from 'react';
import type { Message, UseWebSocketOptions, UseWebSocketReturn } from './types';

export const useWebSocket = ({
  url,
  onMessageReceived,
  autoConnect = true,
}: UseWebSocketOptions): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessageReceived);

  useEffect(() => {
  onMessageRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!autoConnect) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data: Message = JSON.parse(event.data);
        if (onMessageRef.current) {
          onMessageRef.current(data);
        }
      } catch (err) {
        console.error('Ошибка парсинга сообщения:', err);
        if (onMessageReceived) 
            { onMessageReceived({ 
               
               text: event.data,  
               senderId: 'other',
               
            });
         }
      }
    };

    socket.onerror = () => {
      setError('Ошибка WebSocket соединения');
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
 },  [url, autoConnect]);

  const sendMessage = useCallback((text: string, senderId: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        text,
        senderId,
        timestamp: Date.now(),
      };
      socketRef.current.send(JSON.stringify(messageData));
    } else {
      console.warn('Невозможно отправить сообщение: соединение закрыто');
    }
  }, []);

  return { isConnected, sendMessage, error };
};