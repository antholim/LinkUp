import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import NavigationButtons from "../../components/NavigationButton";

function LoginComponent() {

    const [email,setEmail]=useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{

            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password}),
            });

            const data = await response.json();
            console.log(data)
            if(data.status == 200){
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/home')
            }else{
                alert('Login failed: '+ data.message);
            }
        }catch(error){
            alert('An error occured: '+ error.message);
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
            <h2 className="h2Log">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    {/* <label htmlFor="email" className="textLog">Email:    </label> */}
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
                <br></br>
                {/* <label htmlFor="password" className="textLog">Password:    </label> */}
                    <input 
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange = {(e)=>setPassword(e.target.value)}
                    required
                    />
                </div>

                <br></br><button type="submit">Login</button>
            </form>
            </div>
        </div>
        </div>
    )

} export default LoginComponent;