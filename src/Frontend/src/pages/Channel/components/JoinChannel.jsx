import React, { useEffect, useState } from "react";
import { fetchingService } from "../../../services/fetchingService";

function JoinChannel({ onClose }) {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await fetchingService.get("/get-all-channel", {
          accessToken: localStorage.getItem('accessToken'),
        });
        setChannels(data);
      } catch (error) {
        console.error("Error fetching channels:", error);
        setError("Failed to load channels");
      }
    };
    
    fetchChannels();
  }, []);

  const handleChannelChange = (event) => {
    setSelectedChannel(event.target.value);
    setError(null);
  };

  const handleJoin = async () => {
    if (!selectedChannel) {
      setError("Please select a channel to join");
      return;
    }

    setIsJoining(true);
    
    try {
      await fetchingService.patch("/join-channel", {
        accessToken: localStorage.getItem('accessToken'),
        channelID: selectedChannel
      });
      
      // Close modal on success
      if (onClose) onClose();
      
      // Optionally refresh the page or update the channel list
      window.location.reload();
    } catch (error) {
      console.error("Error joining channel:", error);
      setError("Failed to join channel. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="join-channel-container">
      {error && <div className="error-message">{error}</div>}
      
      <select
        value={selectedChannel}
        onChange={handleChannelChange}
        className="select-dropdown"
        disabled={isJoining}
      >
        <option value="">Select a channel</option>
        {channels.map((channel) => (
          <option key={channel._id} value={channel._id}>
            {channel.channelName}
          </option>
        ))}
      </select>
      
      <div className="modal-actions">
        <button 
          onClick={handleJoin} 
          className="action-button"
          disabled={isJoining || !selectedChannel}
        >
          {isJoining ? "Joining..." : "Join Channel"}
        </button>
      </div>
    </div>
  );
}

export default JoinChannel;