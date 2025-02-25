import React from 'react';
import { categories } from '../../../data/FakeChannels';
import { useState, useRef } from 'react';
import JoinChannel from './JoinChannel';
import ModalPortal from '../../../Components/Modal/ModalPortal';

let plus = '+';
let minus = '-';
const ChannelsSidebar = ({ serverName, activeChannel, onChannelSelect }) => {
    const [creatingChannel, setCreatingChannel] = useState(false);
    const inputRef = useRef(null);
    const handleCreateChannel = () => {
        categories[0].channels.push({ id: categories[0].channels.length, name: inputRef.current.value, icon: '#' });
        setCreatingChannel(false);
    }
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
                        {category.channels.map(channel => (
                            <div
                                key={channel.id}
                                className={`channel-item ${activeChannel === channel.name ? 'active' : ''}`}
                                onClick={() => onChannelSelect(channel.name)}
                            >
                                <span className="channel-icon">{channel.icon}</span>
                                {channel.name}
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