import React, { useState, useEffect } from 'react';
import ChannelsSidebar from './components/ChannelsSidebar';
import ChatArea from './components/ChatArea';
import './ChannelsPage.css';
import { fetchingService } from '../../services/fetchingService';

const ChannelsPage = () => {
    const [activeChannel, setActiveChannel] = useState({});
    const [channels, setChannels] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            const data = await fetchingService.get("/get-all-channel", {
                accessToken: localStorage.getItem('accessToken'),
            }, null)
            setChannels(data)
        }
        fetch();
    }, [])
    return (
        <div className="channels-container">/
            <ChannelsSidebar 
                serverName={"Link Up"}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
                channels={channels}
            />
            <ChatArea 
                channel={activeChannel}
                channels={channels}
            />
        </div>
    );
};

export default ChannelsPage;