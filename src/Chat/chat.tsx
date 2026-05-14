import { useWebSocket } from '../Hook/UseWebsocket';
import type { Message as WSMessage } from '../Hook/UseWebsocket';
import { useState, useEffect } from 'react';
import './chat.css';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
}

export const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет!', sender: 'other' },
    { id: 2, text: 'Как дела?', sender: 'other' },
  ]);

  const { isConnected, sendMessage } = useWebSocket({
    url: 'ws://127.0.0.1:8000/ws/chat/',
    onMessageReceived: (newMessage: WSMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id || newMessage.timestamp || Date.now(),
          text: newMessage.text,
          sender:
            newMessage.sender === 'me' || newMessage.senderId === 'me'
              ? 'me'
              : 'other',
        },
      ]);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const chatCloseOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Отправляем сообщение на backend через WebSocket.
    // В чат сообщение добавляется только после ответа от backend/WebSocket.
    sendMessage(inputValue, 'me');

    // Очищаем поле ввода.
    setInputValue('');
  };

  if (!isVisible) return null;

  return (
    <div className={`chat_container ${isOpen ? 'active' : ''}`}>
      <div className="chat_place">
        <div className="messages_list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input">
          <textarea
            className="text"
            placeholder="world......."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            rows={1}
          />

          <button
            className="send"
            onClick={handleSend}
            disabled={!isConnected || !inputValue.trim()}
          >
            send
          </button>
        </div>
      </div>

      <div className="chat_icon" onClick={chatCloseOpen}>
        <img className="icona" src="./icona.svg" alt="icon" />
      </div>
    </div>
  );
};