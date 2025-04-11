import React, { useState, useEffect, useRef } from 'react';
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
    const messagesEndRef = useRef(null);

    // Function to decode the JWT token manually
    const getUserRoleFromToken = () => {
        const token = localStorage.getItem('accessToken');  // Or fetch from cookies/session
        if (token) {
            // Split the token into parts
            const base64Payload = token.split('.')[1];
            if (base64Payload) {
                // Decode the Base64-encoded string
                const decodedPayload = atob(base64Payload);
                try {
                    // Parse the JSON payload
                    const payload = JSON.parse(decodedPayload);
                    return payload.role;  // Return the user's role
                } catch (e) {
                    console.error('Error decoding JWT payload', e);
                }
            }
        }
        return null; // Return null if token is not valid or no role found
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({  });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const getInitials = (username) => {
        if (!username) return 'U';
        const names = username.split(' ');
        return names.map(name => name.charAt(0).toUpperCase()).join('');
    };

    const handleDeleteMessage = (messageId) => {
        const currentUserRole = getUserRoleFromToken();
        // Only allow admins to delete messages
        if (currentUserRole === 'admin') {
            sendJSON('delete_message', {
                messageId: messageId,
                channelId: channel.channelID,
                accessToken: localStorage.getItem('accessToken')
            });
        } else {
            alert("You don't have permission to delete this message.");
        }
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
                            {getInitials(msg?.senderUsername)}
                        </div>
                        <div className="message-body">
                            <div className="message-header">
                                <span className="message-author">{msg?.senderUsername}</span>
                                <span className="message-timestamp">{formatDate(msg.createdAt)}</span>
                                {getUserRoleFromToken() === 'admin' && (
                                    <button className="delete-message-btn" onClick={() => handleDeleteMessage(msg._id)}>
                                        <span className="delete-icon">×</span>
                                    </button>
                                )}
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message in #${channel?.channelName}`}
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatArea;