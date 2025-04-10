import { useNavigate } from 'react-router-dom';
import './RootPage.css';

function RootPage() {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    const welcomeStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
    };

    const leftColumnLogStyles = {
        textAlign: 'center',
        marginBottom: '2rem',
    };


    const titleStyles = {
        fontSize: '4rem',  // large font size for LINKUP
        fontWeight: 'bold',
        marginBottom: '1rem',
    };

    const sloganStyles = {
        fontSize: '2rem', // smaller size for the slogan
        fontWeight: 'bold',
        lineHeight: '2.5rem', // spacing between lines
    };

    const contentStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '900px',
        gap: '2rem',
    };

    const columnStyles = {
        textAlign: 'center',
        flex: 1,
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
    };

    return (
        <div className="welcome" style={welcomeStyles}>
            {/* Header Section */}
            <div className="left-column-log" style={leftColumnLogStyles}>
                <h1 className="Title" style={titleStyles}>
                    LINKUP <br />
                </h1>
                <h2 className="slogan" style={sloganStyles}>
                    Connect.<br />
                    Collaborate.<br />
                    Create.
                </h2>
            </div>

            {/* Login/Signup Section */}
            <div className="content" style={contentStyles}>
                <div className="left-column" style={columnStyles}>
                    <h1>Login to Your Account</h1>
                    <p>Login with your email</p>
                    <button onClick={handleLoginRedirect}>Log In</button>
                </div>

                <div className="right-column" style={columnStyles}>
                    <h2>New Here?</h2>
                    <p>Sign up and discover a great amount of new opportunities!</p>
                    <button onClick={handleRegisterRedirect}>Sign Up</button>
                </div>
            </div>
        </div>
    );
}

export default RootPage;