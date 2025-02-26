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

return (

    <div className="welcome">
    <div className="content">
        <div className="left-column">
        <h1>Login to Your Account</h1>
        <p>Login with your email</p>
        <button onClick={handleLoginRedirect}>Log In</button>
        </div>

        <div className="right-column">
        <h2>New Here?</h2>
        <p>Sign up and discover a great amount of new opportunities!</p>
        <button onClick={handleRegisterRedirect}>Sign Up</button>
        </div>
    </div>
    </div>
    );
}

export default RootPage;
