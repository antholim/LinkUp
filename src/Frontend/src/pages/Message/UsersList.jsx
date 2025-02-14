import { useState, useEffect } from 'react';
import {fakeUsers} from "../data/FakeUsers.js"

function UsersList({ onSelectUser }) {
    const [users, setUsers] = useState(fakeUsers);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await response.json();
                if (data.status === 200) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="users-list">
            <div className="users-list-header">
                <h2>Direct Messages</h2>
            </div>
            <div className="users-list-content">
                {loading ? (
                    <div>Loading users...</div>
                ) : (
                    users.map(user => (
                        <div 
                            key={user.id}
                            className="user-item"
                            onClick={() => onSelectUser(user)}
                        >
                            <div className="user-avatar">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user.username}</div>
                                <div className="user-status">
                                    {user.online ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UsersList;