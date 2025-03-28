import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App.jsx";

function HomeComponent() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(() => false);
        navigate("/login");
    };
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "30px", padding: "0 20px", background: "linear-gradient(135deg, #fff8f0 0%, #fff 100%)", minHeight: "100vh" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "30px" }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "15px",
                            boxShadow: "0 4px 10px rgba(255, 140, 0, 0.3)"
                        }}>
                            <span style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>L</span>
                        </div>
                        <h1 style={{
                            color: "#FF8C00",
                            fontSize: "2.5rem",
                            fontWeight: "800",
                            margin: 0,
                            background: "linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            LinkUp
                        </h1>
                    </div>

                    <h2 style={{
                        color: "#444",
                        fontSize: "1.8rem",
                        marginBottom: "30px",
                        fontWeight: "500"
                    }}>
                        Connect. Collaborate. Communicate.
                    </h2>


                    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <button
                            onClick={() => navigate("/channels")}
                            style={{
                                padding: "14px 28px",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                color: "white",
                                backgroundColor: "#FF8C00",
                                border: "none",
                                borderRadius: "30px",
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(255, 140, 0, 0.3)",
                                transition: "all 0.3s ease"
                            }}
                            className="nav-button"
                        >
                            Explore Channels
                        </button>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "14px 28px",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                color: "#FF8C00",
                                backgroundColor: "white",
                                border: "1px solid #FF8C00",
                                borderRadius: "30px",
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(255, 140, 0, 0.1)",
                                transition: "all 0.3s ease"
                            }}
                            className="nav-button"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => navigate("/direct-message")}
                            style={{
                                padding: "14px 28px",
                                fontSize: "1.1rem",
                                fontWeight: "600",
                                color: "white",
                                backgroundColor: "#FF8C00",
                                border: "none",
                                borderRadius: "30px",
                                cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(255, 140, 0, 0.3)",
                                transition: "all 0.3s ease"
                            }}
                            className="nav-button"
                        >
                            Direct Messaging
                        </button>
                    </div>

                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "40px",
                        boxShadow: "0 10px 30px rgba(255, 140, 0, 0.1)",
                        marginBottom: "40px"
                    }}>
                        <p style={{
                            fontSize: "1.2rem",
                            lineHeight: "1.8",
                            color: "#555",
                            marginBottom: "30px",
                            textAlign: "center"
                        }}>
                            A versatile communication platform designed for seamless interaction through text channels and direct messaging.
                            Create your digital space where ideas flow freely and collaboration thrives.
                        </p>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "25px",
                            marginBottom: "40px"
                        }}>
                            <div 
                                className="feature-card" 
                                onClick={() => navigate("/channels")}
                                style={{
                                    padding: "25px",
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #fff8f0 0%, #fff 100%)",
                                    boxShadow: "0 5px 15px rgba(255, 140, 0, 0.1)",
                                    border: "1px solid rgba(255, 140, 0, 0.2)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 20px rgba(255, 140, 0, 0.2)"
                                    }
                                }}
                            >
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "rgba(255, 140, 0, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                    <span style={{ fontSize: "24px", color: "#FF8C00" }}>📢</span>
                                </div>
                                <h3 style={{ color: "#FF8C00", marginBottom: "15px", fontSize: "1.4rem" }}>Text Channels</h3>
                                <p style={{ color: "#666", lineHeight: "1.6", textAlign: "left" }}>
                                    Join topic-specific channels like "General," "Project Help," and "Social" to engage in organized group discussions.
                                </p>
                            </div>

                            <div 
                                className="feature-card" 
                                onClick={() => navigate("/direct-message")}
                                style={{
                                    padding: "25px",
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #fff8f0 0%, #fff 100%)",
                                    boxShadow: "0 5px 15px rgba(255, 140, 0, 0.1)",
                                    border: "1px solid rgba(255, 140, 0, 0.2)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 20px rgba(255, 140, 0, 0.2)"
                                    }
                                }}
                            >
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "rgba(255, 140, 0, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                    <span style={{ fontSize: "24px", color: "#FF8C00" }}>💬</span>
                                </div>
                                <h3 style={{ color: "#FF8C00", marginBottom: "15px", fontSize: "1.4rem" }}>Direct Messaging</h3>
                                <p style={{ color: "#666", lineHeight: "1.6", textAlign: "left" }}>
                                    Connect privately with team members through one-on-one conversations for focused communication.
                                </p>
                            </div>

                            <div 
                                className="feature-card" 
                                onClick={() => navigate("/channels")}
                                style={{
                                    padding: "25px",
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #fff8f0 0%, #fff 100%)",
                                    boxShadow: "0 5px 15px rgba(255, 140, 0, 0.1)",
                                    border: "1px solid rgba(255, 140, 0, 0.2)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 20px rgba(255, 140, 0, 0.2)"
                                    }
                                }}
                            >
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "rgba(255, 140, 0, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                    <span style={{ fontSize: "24px", color: "#FF8C00" }}>🔐</span>
                                </div>
                                <h3 style={{ color: "#FF8C00", marginBottom: "15px", fontSize: "1.4rem" }}>Role-Based Access</h3>
                                <p style={{ color: "#666", lineHeight: "1.6", textAlign: "left" }}>
                                    Admin and Member roles with different permissions for channel management and content moderation.
                                </p>
                            </div>
                            <div 
                                className="feature-card" 
                                onClick={() => navigate("/AI")}
                                style={{
                                    padding: "25px",
                                    borderRadius: "15px",
                                    background: "linear-gradient(135deg, #fff8f0 0%, #fff 100%)",
                                    boxShadow: "0 5px 15px rgba(255, 140, 0, 0.1)",
                                    border: "1px solid rgba(255, 140, 0, 0.2)",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 20px rgba(255, 140, 0, 0.2)"
                                    }
                                }}
                            >
                                <div style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    background: "rgba(255, 140, 0, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "20px"
                                }}>
                                    <span style={{ fontSize: "24px", color: "#FF8C00" }}>🤐</span>
                                </div>
                                <h3 style={{ color: "#FF8C00", marginBottom: "15px", fontSize: "1.4rem" }}>AI Censoring</h3>
                                <p style={{ color: "#666", lineHeight: "1.6", textAlign: "left" }}>
                                    Automated moderation feature that screens and filters sensitive or harmful content using AI-driven algorithms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeComponent;