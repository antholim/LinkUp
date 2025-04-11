import AIComponent from "./AIComponent.jsx";
import "./AIPage.css";
import NavigationSidebar from "../../components/NavigationSidebar/NavigationSidebar.jsx";
import { useState } from 'react';

function AIPage() {
    const accessToken = localStorage.getItem("accessToken")
    return (
        <div className="AI-container">
            <NavigationSidebar 
                activeItem="settings"
            />
            <AIComponent accessToken={accessToken}/>
        </div>
    );
}

export default AIPage;
