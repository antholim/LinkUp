import React, { useEffect, useCallback } from 'react';
import { categories } from '../../../data/FakeChannels';
import { useState, useRef } from 'react';
import JoinChannel from './JoinChannel';
import DeleteChannel from './DeleteChannel';
import ModalPortal from '../../../Components/Modal/ModalPortal';
import { fetchingService } from '../../../services/fetchingService';

let plus = '+';
let minus = '-';
const ChannelsSidebar = ({ serverName, activeChannel, onChannelSelect, channels }) => {
    const [creatingChannel, setCreatingChannel] = useState(false);
    const inputRef = useRef(null);
    const handleCreateChannel = () => {
        const fetch = async () => {
            const data = await fetchingService.post("/create-channel", {
                accessToken: localStorage.getItem('accessToken'),
                channelName: inputRef.current.value
            })
            setCreatingChannel(false);
        }
        fetch();
    }
    const handleDeleteChannel = () => {
        const fetch = async () => {
            const data = await fetchingService.post("/delete-channel", {
                accessToken: localStorage.getItem('accessToken'),

            })
        }
        fetch();
    }
    // const stableHandleCreateChannel = useCallback(handleCreateChannel, []);
    // useEffect(() => {
    //     const fetch = async () => {
    //         const data = await fetchingService.get("/get-all-channel", {
    //             accessToken: localStorage.getItem('accessToken'),
    //         }, null)
    //         setChannels(data)
    //     }
    //     fetch();
    // }, [])
    const modalRef = useRef();
    const modalDeleteRef = useRef();
    const openModal = () => {
        modalRef.current?.open()
    }
    const closeModal = () => {
        modalRef.current?.close()
    }
    const openModalDelete = () => {
        modalDeleteRef.current?.open()
    }
    const closeModalDelete = () => {
        modalDeleteRef.current?.close()
    }
    return (
        <div className="channels-sidebar">
            <div className="server-header">
                {serverName}
            </div>
            {categories.map(category => (
                <div key={category.name}>
                    <button onClick={openModal}>Join channel</button>
                    <button onClick={openModalDelete}>Delete channel</button>
                    <ModalPortal ref={modalRef} title="Join channel" content={<JoinChannel />} actions={<button onClick={closeModal}>Close</button>} />
                    <ModalPortal ref={modalDeleteRef} title="Delete channel" content={<DeleteChannel />} actions={<button onClick={closeModalDelete}>Close</button>} />
                    <div className="channels-category">
                        {category.name}
                        <button className='create-channel-button' onClick={() => {
                            setCreatingChannel(() => !creatingChannel);
                        }}>{creatingChannel ? minus : plus}</button>
                    </div>
                    <div className="channel-list">
                        {channels.map(channel => (
                            <div
                                key={channel._id}
                                className={`channel-item ${activeChannel.channelID === channel._id ? 'active' : ''}`}
                                onClick={() => onChannelSelect({channelID:channel._id, channelName : channel.channelName})}
                            >
                                <span className="channel-icon">{channel.icon}</span>
                                # {channel.channelName}
                            </div>
                        ))}

                        {creatingChannel && <>
                            <input ref={inputRef} className='input-channel' />
                            <button onClick={handleCreateChannel}>Create</button>
                        </>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChannelsSidebar;