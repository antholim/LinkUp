    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { formatDate } from '../../utils/utils';

    const ChatArea = ({
        channel,
        channels,
        messages,
        isConnected,
        connectionError,
        sendJSON,
        setRealChannel 
    }) => {
        const [message, setMessage] = useState('');
        const messagesEndRef = useRef(null);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({});
        };

        useEffect(() => {
            scrollToBottom();
        }, [messages]);

        useEffect(() => {
            if (channel && channel.channelID) {
                console.log('Saving channel ID to localStorage:', channel.channelID);
                localStorage.setItem('lastVisitedChannelID', channel.channelID);
            }
        }, [channel]);

        const handleSendMessage = (e) => {
            e.preventDefault();
            if (!message.trim() || !isConnected) return;

            const tempId = `temp-${Date.now()}`;
            console.log(channel, "ICI")
            console.log({
                channelId: channel.channelID,
                content: message,
                tempId,
                accessToken: localStorage.getItem('accessToken')
            }, "TEST")
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
                    <span className="chat-header-title">{channel?.username || 'Select a channel'}</span>
                </div>

                <div className="messages-container">
                    {channel?.channelID && messages[channel.channelID] && messages[channel.channelID].map(msg => (
                        <div key={msg._id || `msg-${Date.now()}-${Math.random()}`} className="message">
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
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="message-input-container">
                    <input
                        type="text"
                        className="message-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${channel?.username ? `#${channel.username}` : ''}`}
                        disabled={!channel?.channelID}
                    />
                    <button type="submit" className="send-button" disabled={!channel?.channelID}>
                        Send
                    </button>
                </form>
            </div>
        );
    };

    export default ChatArea;