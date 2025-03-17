import AIComponent from "./AIComponent.jsx";
import "./AIPage.css";

function AIPage() {
    const accessToken = localStorage.getItem("accessToken")
    return (
        <div className="AI-container">
            <AIComponent accessToken={accessToken}/>
        </div>
    );
}

export default AIPage;
