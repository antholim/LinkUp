import React from 'react';
import { categories } from '../../../data/FakeChannels';

const ChannelsSidebar = ({ serverName, activeChannel, onChannelSelect }) => {

    return (
        <div className="channels-sidebar">
            <div className="server-header">
                {serverName}
            </div>
            {categories.map(category => (
                <div key={category.name}>
                    <div className="channels-category">
                        {category.name}
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
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChannelsSidebar;