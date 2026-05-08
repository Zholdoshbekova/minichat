import { useState } from 'react';
import './chat.css';

interface Chat {}

export const Chat = () => {
    const [ isOpen, setIsOpen ] = useState(false);

    return ( 
        <div className='chat_container'>
            <div className='chat_place'>
                <textarea className='text' placeholder='world........'/>
            </div>

            <div className='chat_icon' onClick={() => setIsOpen(!isOpen)}>
                <img className='icona'  src="/chat.svg" alt="icon" />
            </div>
        </div>
    );
};