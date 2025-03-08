import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import RootPage from './pages/Root/RootPage';
import MessagingPage from "./pages/Message/MessagingPage";
import ChannelsPage from "./pages/Channel/ChannelsPage";
import { useEffect, useState, createContext, useContext } from "react";
import { fetchingService } from "./services/fetchingService";

// Create an auth context
export const AuthContext = createContext(null);

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authenticate = async () => {
      try {
        if (token) {
          const response = await fetchingService.post("/authenticate", {accessToken: token}, {}, true);
          if (response?.status === 200) {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    authenticate();
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

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
    {
      path: "/direct-message",
      element: isAuthenticated ? <MessagingPage /> : <Navigate to="/login" />, // Fixed condition
    },
    {
      path: "/channels",
      element: isAuthenticated ? <ChannelsPage /> : <Navigate to="/login" />, // Fixed condition
    },
  ]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;