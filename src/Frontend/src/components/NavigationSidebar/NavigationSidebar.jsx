import React from 'react';
import './NavigationSidebar.css';

const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-comments', href: '/home' },
    { id: 'messages', label: 'Channels', icon: 'fas fa-comments', href: '/channels' },
    { id: 'friends', label: 'Friends', icon: 'fas fa-users', href: '/direct-message' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', href: '/AI' }
];
const NavigationSidebar = ({ 
    activeItem = '', 
    onNavItemClick,
    logo 
}) => {
    return (
        <div className="navigation-sidebar">
            <div className="nav-logo">
                {logo || <span>Logo</span>}
            </div>
            <nav className="nav-links">
                {navItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                        onClick={(e) => {
                            onNavItemClick?.(item);
                        }}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="nav-footer">

            </div>
        </div>
    );
};

export default NavigationSidebar; 