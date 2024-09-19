// ChatBot.js
import React, { useState } from 'react';
import './ChatBot.css'; // Create this CSS file for styling

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, type: 'user' }]);
            setInput('');
            setTimeout(() => {
                setMessages([...messages, { text: input, type: 'user' }, { text: 'I am a simple bot. How can I help you?', type: 'bot' }]);
            }, 1000);
        }
    };

    return (
        <div className="chatbot">
            <div className="chatbox">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
