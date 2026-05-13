import { useState, useEffect } from 'react';
import './chat.css';
import chatIcon from './chat.svg';



interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
}

export const ChatI = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([ 
    { id: 1, text: "Привет!", sender: 'other' },
    { id: 2, text: "Как дела?", sender: 'other' },
  ]);
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

    
    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInterval('');
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
          <button className='send' onClick={handleSend}>send</button>
        </div>
      </div>

      <div className='chat_icon' onClick={ChatCloseOpen}>
        <img className='icona' src={chatIcon} alt="icon" />
      </div>
    </div>
  );

};

type BackendStatus = 'checking' | 'connected' | 'error';

export const Chat = () => {
    const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
    const [backendMessage, setBackendMessage] = useState('Checking backend...');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/health/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Backend error: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                setBackendStatus('connected');
                setBackendMessage(data.message || 'Connected');
            })
            .catch((error) => {
                console.error('Backend connection error:', error);
                setBackendStatus('error');
                setBackendMessage('Backend connection error');
            });
    }, []);

    return (
        <>
            <div className="chat_icon">
                <img className="icona" src="/chat.svg" alt="icon" />
            </div>

            <div className={`backend_status backend_status_${backendStatus}`}>
                Backend: {backendMessage}
            </div>
        </>
    );
};

