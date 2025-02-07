import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginComponent() {

    const [email,setEmail]=useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}),
            });

            const data = await response.json();

            if(data.success){
                localStorage.setItem('authToken', data.token);
                navigate('/home')
            }else{
                alert('Login failed: '+ data.message);
            }
        }catch(error){
            alert('An error occured: '+ error.message);
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
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

                <button type="submit">Login</button>
            </form>
        </div>
    )

} export default LoginComponent;