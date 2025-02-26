import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButtons from "../../components/NavigationButton";

function RegisterComponent() {

    const [email,setEmail]=useState('');
    const [username, setUsername]=useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

            // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
  
    try {
        // Send registration request to backend
        const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        if (data.status === 200) {
        alert('Registration successful! Please login.');
        navigate('/login');
        } else {
        alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }


    };
    
    return (
        <div className="page">
            <NavigationButtons />
            <div className="content">
            <div className="left-column-log">
                    <h1 className="Title">LINKUP <br />
                    <h1 className="slogan">Connect. <br></br>
                        Collaborate. <br></br>
                        Create.</h1></h1>
            </div>
            
            <div className="right-column-log">
            <h2 className="h2Log">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange = {(e)=>setEmail(e.target.value)}
                    required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    id="username"
                    type="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange = {(e)=>setUsername(e.target.value)}
                    required
                    />
                </div>
                

                <div className="input-group">
                <label htmlFor="password">Password</label>
                    <input 
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange = {(e)=>setPassword(e.target.value)}
                    required
                    />
                </div>
                <div className="input-group">
                <label htmlFor="password">Confirm Password</label>
                    <input
                    id="confirmingPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange = {(e)=>setConfirmPassword(e.target.value)}
                    required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            </div>
        </div>

        </div>
    )
} export default RegisterComponent;