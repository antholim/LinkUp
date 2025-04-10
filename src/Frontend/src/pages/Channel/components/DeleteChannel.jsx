import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import AdminOnly from "../../../components/AdminOnly";
import { useAuth } from "../../../components/AuthContext"; // adjust path if needed
import { fetchingService } from "../../../services/fetchingService";



function DeleteChannel({ onClose }) {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDelete = async () => {

    if (!selectedChannel) {
      setError("Please select a channel to delete");
      return;
    }

    setIsDeleting(true);
    
    try {
      await fetchingService.patch("/delete-channel", {
        accessToken: localStorage.getItem('accessToken'),
        channelID: selectedChannel
      });
      
      // Close modal on success
      if (onClose) onClose();
      
      // Optionally refresh the page or update the channel list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting channel:", error);
      setError("Failed to delete channel. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-channel-container">
      {error && <div className="error-message">{error}</div>}
      
      <select
        value={selectedChannel}
        onChange={handleChannelChange}
        className="select-dropdown"
        disabled={isDeleting}
      >
        <option value="">Select a channel</option>
        {channels.map((channel) => (
          <option key={channel._id} value={channel._id}>
            {channel.channelName}
          </option>
        ))}
      </select>
      <AdminOnly>
        <div className="modal-actions">
              {user?.role === 'admin' && (
            <button 
              onClick={handleDelete} 
              className="action-button"
              disabled={isDeleting || !selectedChannel}
            >
              {isDeleting ? "Deleting..." : "Delete Channel"}
            </button>
          )}
        </div>
      </AdminOnly>
    </div>
  );
}
DeleteChannel.propTypes = {
  onClose: PropTypes.func
};

export default DeleteChannel;