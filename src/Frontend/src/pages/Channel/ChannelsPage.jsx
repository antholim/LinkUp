import React, { useState } from 'react';
import ChannelsSidebar from './components/ChannelsSidebar';
import ChatArea from './components/ChatArea';
import './ChannelsPage.css';

const ChannelsPage = () => {
    const [activeChannel, setActiveChannel] = useState('general');

    return (
        <div className="channels-container">/
            <ChannelsSidebar 
                serverName={"Link Up"}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
            />
            <ChatArea 
                channel={activeChannel}
            />
        </div>
    );
};

export default ChannelsPage;