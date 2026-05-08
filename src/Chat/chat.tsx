import { useEffect, useState } from 'react';
import './chat.css';

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
