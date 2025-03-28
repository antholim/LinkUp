import AIComponent from "./AIComponent.jsx";
import "./AIPage.css";
import { useState } from 'react';

function AIPage() {
    const accessToken = localStorage.getItem("accessToken")
    return (
        <div className="AI-container">
            <AIComponent accessToken={accessToken}/>
        </div>
    );
}

export default AIPage;
