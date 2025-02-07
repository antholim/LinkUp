import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import RootPage from './pages/Root/RootPage';


function App() {

  const[isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{

    const token = localStorage.getItem("authToken");
    if(token){
      setIsAuthenticated(true);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: !isAuthenticated ? <RootPage /> : <Navigate to="/home" />,
    },
    {
      path: "/login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/home" />,
    },
    {
      path: "/register",
      element: !isAuthenticated ? <RegisterPage /> : <Navigate to="/home" />,
    },
    {
      path: "/home",
      element: isAuthenticated ? <HomePage /> : <Navigate to="/login" />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
