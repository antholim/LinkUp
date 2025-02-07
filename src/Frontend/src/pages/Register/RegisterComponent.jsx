import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterComponent() {

    const [email,setEmail]=useState('');
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
        const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
        alert('Registration successful! Please login.');
        navigate('/home');
        } else {
        alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }


    };
    
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
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

                <div>
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
                <label htmlFor="password">Confirm Password</label>
                    <input
                    id="confirmingPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange = {(e)=>setConfirmPassword(e.target.value)}
                    required
                    />

                <div>
                    

                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    )
} export default RegisterComponent;