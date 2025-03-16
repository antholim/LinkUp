import React, { useState, useEffect } from 'react';
import { fakeUsers } from '../data/FakeUsers';
import '../css/AddFriends.css';
import { fetchingService } from '../services/fetchingService';

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

    const handleSearchFriend = async () => {
        try {
            // Make a POST request to your backend endpoint
            const response = await fetchingService.post(
                "/find-matching-user", 
                { 
                    accessToken: localStorage.getItem("accessToken"),
                    partialUsername: friendUsername // Send the search term to the backend
                },
                {},
                true
            );
            
            // Check if the response was successful and contains user data
            if (response.status === 200) {
                // Set the returned users from the backend to state
                console.log(response.data.users)
                setPossibleFriends(response.data.users);
            } else {
                // Handle the case when no users are found or there's an error
                setPossibleFriends([]);
                console.log(response?.message || "No matching users found");
            }
            
            // Reset selection when new search is performed
            setSelectedFriend(null);
        } catch (error) {
            console.error("Error searching for friends:", error);
            setPossibleFriends([]);
            // Optionally, set an error state or display a notification
        }
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