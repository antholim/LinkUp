import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChannelsSidebar from './components/ChannelsSidebar';
import ChatArea from './components/ChatArea';
import './ChannelsPage.css';
import { fetchingService } from '../../services/fetchingService';
import NavigationSidebar from '../../components/NavigationSidebar/NavigationSidebar';
// import { ChatProvider } from './components/ChatContext';

const ChannelsPage = () => {
    const [activeChannel, setActiveChannel] = useState({});
    const [channels, setChannels] = useState([]);
    const [messages, setMessages] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true)

    const wsRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000;

    const sendJSON = useCallback((type, data) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log('WebSocket not ready, message not sent:', { type, data });
            return;
        }
        ws.send(JSON.stringify({ type, data }));
    }, []);

    // Fetch channels
    useEffect(() => {
        const fetch = async () => {
            let data = await fetchingService.get("/get-all-channel", {
                accessToken: localStorage.getItem('accessToken'),
            });
            data = data.filter(channel => channel.type !== "direct_message");
            setChannels(data);
        };
        fetch();
    }, []);

    // WebSocket connection
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log(channels)
        if (!token) return;

        const connectWebSocket = () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log('Already connected');
                return;
            }

            try {
                console.log('Attempting to connect to WebSocket...');
                const ws = new WebSocket('ws://localhost:4000');
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('Connected to chat server');
                    setIsConnected(true);
                    setConnectionError(null);
                    reconnectAttempts.current = 0;

                    // Authenticate immediately
                    sendJSON('authenticate', {
                        accessToken: localStorage.getItem('accessToken')
                    });
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log('Received message:', message);

                        switch (message.type) {
                            case 'authenticated':
                                console.log('Authentication successful');
                                break;

                            case 'new_message':
                                console.log("received new message")
                                setMessages(prev => {
                                    const channelId = message.data.channelId;
                                    const channelMessages = prev[channelId] || [];

                                    // Remove optimistic message if it exists
                                    const filteredMessages = channelMessages.filter(
                                        msg => !msg.isOptimistic ||
                                            (msg._id !== message.data._id && msg.tempId !== message.data._id)
                                    );

                                    return {
                                        ...prev,
                                        [channelId]: [...filteredMessages, message.data]
                                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                    };
                                });
                                break;
                            case 'message_blocked':
                                console.log("Message blocked case triggered:", message);
                                alert(`${message.data.message}\nBlocked by: ${message.data.blockedBy.join(", ")}`);
                                break;
                            case 'error':
                                console.error('WebSocket error:', message.data);
                                break;

                            default:
                                console.log('Unknown message type:', message.type);
                        }
                    } catch (error) {
                        console.error('Error processing message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setConnectionError('Connection error. Please try again later.');
                    setIsConnected(false);
                };

                ws.onclose = (event) => {
                    console.log('WebSocket closed with code:', event.code);
                    setIsConnected(false);

                    if (event.code === 1000 || event.code === 1001) {
                        console.log('Clean WebSocket closure');
                        return;
                    }

                    if (reconnectAttempts.current < maxReconnectAttempts) {
                        const delay = Math.min(
                            baseReconnectDelay * Math.pow(2, reconnectAttempts.current),
                            30000
                        );

                        console.log(`Reconnecting in ${delay}ms... (Attempt ${reconnectAttempts.current + 1})`);

                        setTimeout(() => {
                            reconnectAttempts.current += 1;
                            connectWebSocket();
                        }, delay);
                    } else {
                        setConnectionError('Unable to establish connection. Please refresh the page.');
                    }
                };
            } catch (error) {
                console.error('Error creating WebSocket:', error);
                setConnectionError('Failed to create WebSocket connection');
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close(1000, 'Component unmounting');
                wsRef.current = null;
            }
        };
    }, [sendJSON]);

    useEffect(() => {
        if (!isConnected) return;

        const pingInterval = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                sendJSON('ping', {});
            }
        }, 30000);

        return () => clearInterval(pingInterval);
    }, [isConnected, sendJSON]);

    return (
        <div className="channels-container">
            <NavigationSidebar 
                activeItem="messages"
            />
            <ChannelsSidebar
                serverName={"Link Up"}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
                channels={channels}
                sendJSON={sendJSON}
                setMessages={setMessages}
                messages={messages}
                setIsLoadingMessages={setIsLoadingMessages}
            />
            {!isLoadingMessages &&
                <ChatArea
                    channel={activeChannel}
                    channels={channels}
                    messages={messages}
                    isConnected={isConnected}
                    connectionError={connectionError}
                    sendJSON={sendJSON}
                />}

        </div>
    );
};

export default ChannelsPage;