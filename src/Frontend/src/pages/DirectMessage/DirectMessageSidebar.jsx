import React, { useState, useRef } from 'react';
import ModalPortal from '../../Components/Modal/ModalPortal';
import { fetchingService } from '../../services/fetchingService';
import AddFriends from '../../components/AddFriends';

const DirectMessageSidebar = ({
    serverName,
    activeChannel,
    onChannelSelect,
    channels,
    sendJSON,
    setMessages,
    messages,
    setIsLoadingMessages,
    isLoading,
    realChannel,
    setRealChannel
}) => {
    const [creatingChannel, setCreatingChannel] = useState(false);
    const inputRef = useRef(null);
    const modalRef = useRef();
    const modalDeleteRef = useRef();


    const handleSelectChannel = async (friend) => {
        if (activeChannel._id === friend._id) return;
        setIsLoadingMessages(true);
    
        let channelId;
        let channelData;
        try {
            const response = await fetchingService.post("/get-or-create-dm-channel", {
                accessToken: localStorage.getItem('accessToken'),
                friendId: friend._id
            });
    
            channelId = response._id;
            channelData = {
                channelID: response._id,
                username: friend.username 
            };
    
            console.log("Resolved Channel Data:", channelData);
    
            setRealChannel(channelData);
            onChannelSelect(channelData);
    
            localStorage.setItem("lastVisitedChannelID", channelId);
    
            sendJSON('join_channel', {
                channelId: channelId,
                accessToken: localStorage.getItem('accessToken')
            });
    
            const data = await fetchingService.get("/retrieve-channel-message", {
                accessToken: localStorage.getItem('accessToken'),
                channelId: channelId
            });
    
            const messagesArray = Array.isArray(data) ? data : (data ? [data] : []);
            setMessages(prev => ({
                ...prev,
                [channelId]: messagesArray.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                )
            }));
        } catch (error) {
            console.error("Error fetching channel or messages:", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };
    

    const openModal = () => modalRef.current?.open();
    const closeModal = () => modalRef.current?.close();
    const openModalDelete = () => modalDeleteRef.current?.open();
    const closeModalDelete = () => modalDeleteRef.current?.close();

    const renderChannelList = () => {
        if (isLoading) {
            return Array(5).fill(0).map((_, index) => (
                <div key={index} className="channel-item skeleton-loading" style={{ height: '36px' }}></div>
            ));
        }

        if (channels.length === 0) {
            return (
                <div className="empty-channels">
                    <p className="empty-channels-text">No friends available</p>
                </div>
            );
        }

        return channels.map(channel => (
            <div
                key={channel._id}
                className={`channel-item ${activeChannel._id === channel._id ? 'active' : ''}`}
                onClick={() => handleSelectChannel({ _id: channel._id, username: channel.username })}
            >
                <span className="channel-icon">#</span>
                {channel.username}
            </div>
        ));
    };

    return (
        <div className="channels-sidebar">
            <div className="server-header">
                <span>{serverName}</span>
            </div>

            <div>
                <div className="channels-category">
                    <span>Friends list</span>
                    <AddFriends />
                </div>

                <div className="channel-list">
                    {renderChannelList()}
                </div>
            </div>
        </div>
    );
};

export default DirectMessageSidebar;