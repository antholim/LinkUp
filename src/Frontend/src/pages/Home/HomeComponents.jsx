import { useNavigate } from "react-router-dom";
import {useAuth} from "../../App.jsx"


function HomeComponent() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = () => {

        localStorage.removeItem("accessToken");
        setIsAuthenticated(()=> false);
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Homepage! Logged in</h1>
            <button
                onClick={handleLogout}
                style={{
                    padding: "10px 20px",
                    fontSize: "1rem",
                    color: "white",
                    backgroundColor: "#e74c3c",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>
            <button>AUUTHENTICATED</button>
        </div>
    );
}

export default HomeComponent;
