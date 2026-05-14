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
    { id: 1, text: "Привет!", sender: 'other' },
    { id: 2, text: "Как дела?", sender: 'other' },
  ]);
  const { isConnected, sendMessage } = useWebSocket({
    url: 'wss://ws.postman-echo.com/raw',
    onMessageReceived: (newMessage: WSMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.timestamp || Date.now(),
          text: newMessage.text,
          sender: newMessage.senderId === 'me' ? 'me' : 'other',
        }
      ]);
    },
  });
 useEffect(() => {
  const timer = setTimeout(() => {
    setIsVisible(true); 
  }, 5000);

    return () => clearTimeout(timer);
   }, []);
  const ChatCloseOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // 1. Отправляем текст в вебсокет-сервер через наш хук
    sendMessage(inputValue, 'me');

    // 2. Добавляем сообщение локально в чат, чтобы оно отобразилось на экране
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue, sender: 'me' }
    ]);

    // 3. Очищаем инпут
    setInputValue('');
  };
   if (!isVisible) return null;

  return (
    <div className={`chat_container ${isOpen ? 'active' : ''}`}>
      <div className='chat_place'>
        {/* Список сообщений */}
        <div className="messages_list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        
        <div className="input">
          <textarea 
            className='text' 
            placeholder='world.......' 
            value={inputValue}
            onChange={(e) => { 
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px'; 
             }}
             rows={1} 
          />
          <button className='send' onClick={handleSend}disabled={!isConnected || !inputValue.trim()}  >send</button>
        </div>
      </div>

      <div className='chat_icon' onClick={ChatCloseOpen}>
        <img className='icona' src="./icona.svg" alt="icon" />
      </div>
    </div>
  );

};

