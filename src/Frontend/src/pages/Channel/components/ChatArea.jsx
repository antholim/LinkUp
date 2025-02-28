import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatDate } from '../../../utils/utils';

const ChatArea = ({ 
    channel, 
    channels, 
    messages, 
    isConnected, 
    connectionError, 
    sendJSON 
}) => {
    const [message, setMessage] = useState('');
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !isConnected) return;

        const tempId = `temp-${Date.now()}`;
        sendJSON('send_message', {
            channelId: channel.channelID,
            content: message,
            tempId,
            accessToken: localStorage.getItem('accessToken')
        });

        setMessage('');
    };

    return (
        <div className="chat-area">
            <div className="chat-header">
                <span className="chat-header-icon">#</span>
                <span className="chat-header-title">{channel.channelName}</span>
            </div>

            <div className="messages-container">
                {messages[channel?.channelID] && messages[channel.channelID].map(msg => (
                    <div key={msg._id} className="message">
                        <div className="message-avatar">
                            TT
                        </div>
                        <div className="message-body">
                            <div className="message-header">
                                <span className="message-author">{msg?.senderUsername}</span>
                                <span className="message-timestamp">{formatDate(msg.createdAt)}</span>
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