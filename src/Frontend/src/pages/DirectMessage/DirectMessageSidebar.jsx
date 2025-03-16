import React, { useState, useRef } from 'react';
import ModalPortal from '../../Components/Modal/ModalPortal';
import { fetchingService } from '../../services/fetchingService';

const DirectMessageSidebar = ({
    serverName,
    activeChannel,
    onChannelSelect,
    channels,
    sendJSON,
    setMessages,
    messages,
    setIsLoadingMessages,
    isLoading
}) => {
    const [creatingChannel, setCreatingChannel] = useState(false);
    const inputRef = useRef(null);
    const modalRef = useRef();
    const modalDeleteRef = useRef();

    const handleCreateChannel = async () => {
        const channelName = inputRef.current.value.trim();
        if (!channelName) return;

        try {
            await fetchingService.post("/create-channel", {
                accessToken: localStorage.getItem('accessToken'),
                channelName: channelName
            });
            setCreatingChannel(false);
            inputRef.current.value = '';

            // Refresh channels after creating a new one
            // const data = await fetchingService.get("/get-all-channel", {
            //     accessToken: localStorage.getItem('accessToken')
            // });
            channels = data;
            window.location.reload();
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };

    const handleSelectChannel = async (ch) => {
        if (activeChannel._id === ch._id) return;
        console.log(ch)
        onChannelSelect(ch);
        setIsLoadingMessages(true);

        sendJSON('join_channel', {
            channelId: ch._id,
            accessToken: localStorage.getItem('accessToken')
        });

        try {
            const data = await fetchingService.get("/retrieve-channel-message", {
                accessToken: localStorage.getItem('accessToken'),
                channelId: ch._id
            });

            const messagesArray = Array.isArray(data) ? data : (data ? [data] : []);

            setMessages(prev => ({
                ...prev,
                [ch._id]: messagesArray.sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                )
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
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
                    <button
                        className="create-channel-button"
                        onClick={() => {
                            setCreatingChannel(!creatingChannel);
                        }}
                        title={creatingChannel ? "Cancel" : "Create Channel"}
                    >
                        {creatingChannel ? '-' : '+'}
                    </button>
                </div>

                <div className="channel-list">
                    {renderChannelList()}

                    {creatingChannel && (
                        <div className="create-channel-form">
                            <input
                                ref={inputRef}
                                className="input-channel"
                                placeholder="New channel name..."
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateChannel()}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    className="action-button"
                                    onClick={handleCreateChannel}
                                >
                                    Create
                                </button>
                                <button
                                    className="action-button secondary"
                                    onClick={() => setCreatingChannel(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectMessageSidebar;