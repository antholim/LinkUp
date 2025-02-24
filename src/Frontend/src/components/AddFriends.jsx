import React, { useState, useEffect } from 'react';
import { fakeUsers } from '../data/FakeUsers';
import '../css/AddFriends.css';

function AddFriends() {
    const [users, setUsers] = useState(fakeUsers);
    const [loading, setLoading] = useState(true);
    const [addingFriend, setAddingFriend] = useState(false);
    const [friendUsername, setFriendUsername] = useState('');
    const [possibleFriends, setPossibleFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const resetModalState = () => {
        setFriendUsername('');
        setPossibleFriends([]);
        setSelectedFriend(null);
    };

    const handleAddFriend = () => {
        setAddingFriend(true);
    };

    const handleCloseModal = () => {
        setAddingFriend(false);
        resetModalState();
    };

    const handleSearchFriend = () => {
        const friends = users.filter(user => 
            user.username.toLowerCase().includes(friendUsername.toLowerCase())
        );
        setPossibleFriends(friends);
        setSelectedFriend(null); // Reset selection when new search is performed
    };

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
    };

    const handleAddFriendSubmit = () => {
        if (selectedFriend) {
            console.log(`Adding friend: ${selectedFriend.username}`);
            handleCloseModal();
        }
    };

    const getSubmitButtonText = () => {
        return selectedFriend ? `Add ${selectedFriend.username}` : "Select a friend";
    };

    return (
        <div className="add-friends-container">
            <div className="add-friends-header">
                <button className="add-friends-button" onClick={handleAddFriend}>
                    Add Friend
                </button>
            </div>

            {addingFriend && (
                <div className="add-friends-modal-overlay" onClick={handleCloseModal}>
                    <div className="add-friends-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="add-friends-close" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h2 className="add-friends-title">Add a Friend</h2>
                        <input 
                            type="text"
                            className="add-friends-input"
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                            placeholder="Enter friend's username"
                        />
                        <button 
                            className="add-friends-search-btn" 
                            onClick={handleSearchFriend}
                            disabled={!friendUsername.trim()}
                        >
                            Search
                        </button>
                        <div className="add-friends-list">
                            {possibleFriends.map(friend => (
                                <div 
                                    key={friend.id}
                                    className={`add-friends-item ${selectedFriend?.id === friend.id ? "add-friends-selected" : ""}`}
                                    onClick={() => handleSelectFriend(friend)}
                                >
                                    {friend.username}
                                </div>
                            ))}
                        </div>
                        <button 
                            className="add-friends-submit-btn" 
                            onClick={handleAddFriendSubmit} 
                            disabled={!selectedFriend}
                        >
                            {getSubmitButtonText()}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddFriends;