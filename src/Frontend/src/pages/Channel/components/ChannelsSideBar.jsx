import React, { useEffect, useCallback } from 'react';
import { categories } from '../../../data/FakeChannels';
import { useState, useRef } from 'react';
import JoinChannel from './JoinChannel';
import ModalPortal from '../../../Components/Modal/ModalPortal';
import { fetchingService } from '../../../services/fetchingService';

let plus = '+';
let minus = '-';
const ChannelsSidebar = ({ serverName, activeChannel, onChannelSelect }) => {
    const [creatingChannel, setCreatingChannel] = useState(false);
    const [channels, setChannels] = useState([])
    const inputRef = useRef(null);
    const handleCreateChannel = () => {
        const fetch = async () => {
            const data = await fetchingService.post("/create-channel", {
                accessToken:localStorage.getItem('accessToken'),
                channelName:inputRef.current.value
            })
            setCreatingChannel(false);
        }
        fetch();
    }
    // const stableHandleCreateChannel = useCallback(handleCreateChannel, []);
    useEffect(()=> {
        const fetch = async () => {
            const data = await fetchingService.get("/get-all-channel", {
                accessToken:localStorage.getItem('accessToken'),
            }, null)
            setChannels(data)
        }
        fetch();
    }, [])
    const modalRef = useRef();
    const openModal = () => {
        modalRef.current?.open()
      }
    const closeModal = () => {
        modalRef.current?.close()
      }
    return (
        <div className="channels-sidebar">
            <div className="server-header">
                {serverName}
            </div>
            {categories.map(category => (
                <div key={category.name}>
                    <button onClick={openModal}>Join channel</button>
                    <ModalPortal ref={modalRef} title="Join channel" content= {<JoinChannel/>} actions={<button onClick={closeModal}>Close</button>}/>
                    <div className="channels-category">
                        {category.name}
                        <button className='create-channel-button' onClick={()=> {
                            setCreatingChannel(()=> !creatingChannel);
                        }}>{creatingChannel ? minus : plus}</button>
                    </div>
                    <div className="channel-list">
                        {channels.map(channel => (
                            <div
                                key={channel._id}
                                className={`channel-item ${activeChannel === channel.channelName ? 'active' : ''}`}
                                onClick={() => onChannelSelect(channel.channelName)}
                            >
                                <span className="channel-icon">{channel.icon}</span>
                                # {channel.channelName}
                            </div>
                        ))}
                        
                        {creatingChannel && <>
                            <input ref={inputRef} className='input-channel'/>
                            <button onClick={handleCreateChannel}>Create</button>
                        </>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChannelsSidebar;