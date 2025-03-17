import { useState, useEffect, useRef } from 'react';

function ChatWindow({ selectedUser, messages, setMessages }) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            // Fetch messages for selected user
            const fetchMessages = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/messages/${selectedUser.id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });
                    const data = await response.json();
                    if (data.status === 200) {
                        setMessages(data.messages);
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }
    }, [selectedUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    receiverId: selectedUser.id,
                    content: newMessage
                })
            });

            const data = await response.json();
            if (data.status === 200) {
                setMessages(prev => [...prev, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!selectedUser) {
        return (
            <div className="chat-window">
                <div className="no-chat-selected">
                    Select a user to start messaging
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>{selectedUser.username}</h3>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <div 
                        key={message.id}
                        className={`message ${message.senderId === selectedUser.id ? 'received' : 'sent'}`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatWindow;