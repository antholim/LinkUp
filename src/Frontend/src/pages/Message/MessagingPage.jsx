import { useState, useEffect } from 'react';
import './MessagingPage.css';
import UsersList from './UsersList';
import ChatWindow from './ChatWindow';
import AddFriends from '../../components/AddFriends.jsx';


function MessagingPage() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    
    return (
        <div className="messaging-container">
            <UsersList onSelectUser={setSelectedUser} />
            <AddFriends />
            <ChatWindow 
                selectedUser={selectedUser}
                messages={messages}
                setMessages={setMessages}
            />
        </div>  
    );
}

export default MessagingPage;