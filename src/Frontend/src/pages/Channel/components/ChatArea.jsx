import React, { useState } from 'react';

const ChatArea = ({ channel }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            author: 'John Doe',
            content: 'Hello everyone!',
            timestamp: '12:00 PM',
            avatar: 'JD'
        },
        {
            id: 2,
            author: 'Jane Smith',
            content: 'Hi John! How are you?',
            timestamp: '12:01 PM',
            avatar: 'JS'
        }
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            author: 'Current User',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: 'CU'
        };

        setMessages([...messages, newMessage]);
        setMessage('');
    };

    return (
        <div className="chat-area">
            <div className="chat-header">
                <span className="chat-header-icon">#</span>
                <span className="chat-header-title">{channel}</span>
            </div>
            
            <div className="messages-container">
                {messages.map(msg => (
                    <div key={msg.id} className="message">
                        <div className="message-avatar">
                            {msg.avatar}
                        </div>
                        <div className="message-body">
                            <div className="message-header">
                                <span className="message-author">{msg.author}</span>
                                <span className="message-timestamp">{msg.timestamp}</span>
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message #${channel}`}
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatArea;