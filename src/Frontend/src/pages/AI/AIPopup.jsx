import AIComponent from "./AIComponent.jsx";
import "./AIPage.css";

function AIPopup({ isOpen, onClose }) {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!isOpen) return null;
    
    return (
        <div className="ai-popup-overlay">
            <div className="ai-popup-content">
                <button className="ai-popup-close" onClick={onClose}>×</button>
                <div className="AI-container">
                    <AIComponent accessToken={accessToken} />
                </div>
            </div>
        </div>
    );
}

export default AIPopup;