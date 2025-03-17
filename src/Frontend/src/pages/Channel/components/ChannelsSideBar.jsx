import React, { useState, useRef } from 'react';
import { categories } from '../../../data/FakeChannels';
import JoinChannel from './JoinChannel';
import DeleteChannel from './DeleteChannel';
import ModalPortal from '../../../Components/Modal/ModalPortal';
import { fetchingService } from '../../../services/fetchingService';

const ChannelsSidebar = ({
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
            const data = await fetchingService.get("/get-all-channel", {
                accessToken: localStorage.getItem('accessToken')
            });
            channels = data;
            window.location.reload();
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };

    const handleSelectChannel = async (ch) => {
        if (activeChannel.channelID === ch.channelID) return;

        onChannelSelect(ch);
        setIsLoadingMessages(true);

        sendJSON('join_channel', {
            channelId: ch.channelID,
            accessToken: localStorage.getItem('accessToken')
        });

        try {
            const data = await fetchingService.get("/retrieve-channel-message", {
                accessToken: localStorage.getItem('accessToken'),
                channelId: ch.channelID
            });

            const messagesArray = Array.isArray(data) ? data : (data ? [data] : []);

            setMessages(prev => ({
                ...prev,
                [ch.channelID]: messagesArray.sort((a, b) =>
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
                    <p className="empty-channels-text">No channels available</p>
                </div>
            );
        }

        return channels.map(channel => (
            <div
                key={channel._id}
                className={`channel-item ${activeChannel.channelID === channel._id ? 'active' : ''}`}
                onClick={() => handleSelectChannel({ channelID: channel._id, channelName: channel.channelName })}
            >
                <span className="channel-icon">#</span>
                {channel.channelName}
            </div>
        ));
    };

    return (
        <div className="channels-sidebar">
            <div className="server-header">
                <span>{serverName}</span>
                <div className="server-header-actions">
                    <button className="server-header-btn" onClick={openModal} title="Join Channel">
                        <span>+</span>
                    </button>
                    <button className="server-header-btn" onClick={openModalDelete} title="Delete Channel">
                        <span>×</span>
                    </button>
                </div>
            </div>

            <ModalPortal
                ref={modalRef}
                title="Join Channel"
                content={<JoinChannel onClose={closeModal} />}
                actions={<button className="action-button" onClick={closeModal}>Close</button>}
            />

            <ModalPortal
                ref={modalDeleteRef}
                title="Delete Channel"
                content={<DeleteChannel onClose={closeModalDelete} />}
                actions={<button className="action-button" onClick={closeModalDelete}>Close</button>}
            />

            <div>
                <div className="channels-category">
                    <span>Channels</span>
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

export default ChannelsSidebar;