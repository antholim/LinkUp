// import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState({});
//   const [activeChannel, setActiveChannel] = useState(null);
//   const [typingUsers, setTypingUsers] = useState({});
//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionError, setConnectionError] = useState(null);
  
//   // Use refs for WebSocket and message queue
//   const wsRef = useRef(null);
//   const messageQueueRef = useRef([]);
  
//   // Helper function to send JSON data
//   const sendJSON = useCallback((type, data) => {
//     const ws = wsRef.current;
    
//     if (!ws || ws.readyState !== WebSocket.OPEN) {
//       // Queue message to send when connection is established
//       messageQueueRef.current.push({ type, data });
//       return;
//     }
    
//     ws.send(JSON.stringify({ type, data }));
//   }, []);
  
//   // Process messages from queue
//   const processQueue = useCallback(() => {
//     if (messageQueueRef.current.length === 0) return;
    
//     const ws = wsRef.current;
//     if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
//     while (messageQueueRef.current.length > 0) {
//       const msg = messageQueueRef.current.shift();
//       sendJSON(msg.type, msg.data);
//     }
//   }, [sendJSON]);
  
//   // Initialize WebSocket connection
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return;
    
//     const connectWebSocket = () => {
//       // Close existing connection if any
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
      
//       setConnectionError(null);
      
//       // Create new WebSocket connection
//       const ws = new WebSocket('ws://localhost:4000');
//       wsRef.current = ws;
      
//       // Connection opened
//       ws.onopen = () => {
//         console.log('Connected to chat server');
//         setIsConnected(true);
        
//         // Authenticate immediately after connection
//         sendJSON('authenticate', { token });
        
//         // Process any queued messages
//         setTimeout(processQueue, 500);
//       };
      
//       // Listen for messages
//       ws.onmessage = (event) => {
//         try {
//           const message = JSON.parse(event.data);
//           console.log('Received message:', message);
          
//           switch (message.type) {
//             case 'authenticated':
//               console.log('Authentication successful');
//               break;
              
//             case 'new_message':
//               setMessages(prev => {
//                 const channelId = message.data.channelId;
//                 const channelMessages = prev[channelId] || [];
                
//                 // Remove optimistic message if it exists
//                 const filteredMessages = channelMessages.filter(
//                   msg => !msg.isOptimistic || (msg._id !== message.data._id && msg.tempId !== message.data._id)
//                 );
                
//                 return {
//                   ...prev,
//                   [channelId]: [...filteredMessages, message.data]
//                     .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
//                 };
//               });
//               break;
              
//             case 'user_typing':
//               const { userId, channelId } = message.data;
//               setTypingUsers(prev => ({
//                 ...prev,
//                 [channelId]: [...(prev[channelId] || []), userId]
//               }));
              
//               // Remove typing indicator after 3 seconds
//               setTimeout(() => {
//                 setTypingUsers(prev => ({
//                   ...prev,
//                   [channelId]: (prev[channelId] || []).filter(id => id !== userId)
//                 }));
//               }, 3000);
//               break;
              
//             case 'error':
//               console.error('WebSocket error:', message.data);
//               break;
              
//             default:
//               console.log('Unknown message type:', message.type);
//           }
//         } catch (error) {
//           console.error('Error processing message:', error);
//         }
//       };
      
//       // Handle errors
//       ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         setConnectionError('Connection error. Please try again later.');
//         setIsConnected(false);
//       };
      
//       // Handle disconnection
//       ws.onclose = () => {
//         console.log('Disconnected from chat server');
//         setIsConnected(false);
        
//         // Attempt to reconnect after a delay (except for authentication errors)
//         if (error.code !== 4001) { // Assuming 4001 is your auth error code
//           setTimeout(() => {
//             connectWebSocket();
//           }, 5000); // Reconnect after 5 seconds
//         }
//       };
//     };
    
//     connectWebSocket();
    
//     // Clean up on unmount
//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//         wsRef.current = null;
//       }
//     };
//   }, [localStorage.getItem("accessToken"), processQueue, sendJSON]);
  
//   // Load messages when changing channels
//   const loadChannelMessages = async (channelId) => {
//     try {
//       // First check if we already have messages for this channel
//       if (messages[channelId] && messages[channelId].length > 0) {
//         return messages[channelId];
//       }
      
//       // If not, fetch from API
//       const response = await fetch(`/api/channels/${channelId}/messages`);
//       const data = await response.json();
      
//       // Update messages state
//       setMessages(prev => ({
//         ...prev,
//         [channelId]: data.sort((a, b) => 
//           new Date(a.createdAt) - new Date(b.createdAt)
//         )
//       }));
      
//       return data;
//     } catch (error) {
//       console.error('Error loading messages:', error);
//       return [];
//     }
//   };
  
//   // Join channel and load messages
//   const joinChannel = useCallback((channelId) => {
//     if (!isConnected) return;
    
//     sendJSON('join_channel', { channelId });
//     setActiveChannel(channelId);
//   }, [isConnected, sendJSON]);
  
//   // Send a chat message
//   const sendMessage = useCallback((channel, content) => {
//     if (!isConnected || !channel) return;

//     const tempId = `temp-${Date.now()}`;
//     const optimisticMessage = {
//       _id: tempId,
//       tempId,
//       channelId: channel._id,
//       content,
//       createdAt: new Date().toISOString(),
//       isOptimistic: true,
//       sender: {
//         _id: localStorage.getItem('userId'),
//         username: localStorage.getItem('username')
//       }
//     };

//     // Add optimistic message
//     setMessages(prev => ({
//       ...prev,
//       [channel._id]: [...(prev[channel._id] || []), optimisticMessage]
//     }));

//     // Send to server
//     sendJSON('send_message', {
//       channelId: channel._id,
//       content,
//       tempId
//     });
//   }, [isConnected, sendJSON]);
  
//   // Send typing indicator
//   const sendTypingIndicator = useCallback((channelId) => {
//     if (!isConnected) return;
//     sendJSON('typing', { channelId });
//   }, [isConnected, sendJSON]);
  
//   // Add reaction to message
//   const addReaction = (messageId, emoji) => {
//     if (!isConnected) return;
//     sendJSON('add_reaction', { messageId, emoji });
//   };
  
//   // Load older messages (pagination)
//   const loadOlderMessages = async (channelId, beforeTimestamp) => {
//     try {
//       const response = await fetch(`/api/channels/${channelId}/messages?before=${beforeTimestamp}`);
//       const olderMessages = await response.json();
      
//       if (olderMessages.length > 0) {
//         setMessages(prev => {
//           const channelMessages = prev[channelId] || [];
//           // Combine and sort all messages
//           return {
//             ...prev,
//             [channelId]: [...olderMessages, ...channelMessages].sort((a, b) => 
//               new Date(a.createdAt) - new Date(b.createdAt)
//             )
//           };
//         });
//       }
      
//       return olderMessages;
//     } catch (error) {
//       console.error('Error loading older messages:', error);
//       return [];
//     }
//   };
  
//   return (
//     <ChatContext.Provider value={{
//       messages,
//       activeChannel,
//       typingUsers,
//       isConnected,
//       connectionError,
//       joinChannel,
//       sendMessage,
//       sendTypingIndicator,
//       addReaction,
//       loadOlderMessages
//     }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);