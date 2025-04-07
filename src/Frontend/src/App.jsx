import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AIPage from "./pages/AI/AIPage";
import ChannelsPage from "./pages/Channel/ChannelsPage";
import MessagingPage from "./pages/DirectMessage/MessagingPage";
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import RootPage from './pages/Root/RootPage';
import { fetchingService } from "./services/fetchingService";


// Create an auth context
export const AuthContext = createContext(null);

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const authenticate = async () => {
      try {
        if (token) {
          const response = await fetchingService.post("/authenticate", {accessToken: token}, {}, true);
          if (response?.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
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
    {
      path: "/AI",
      element: isAuthenticated ? <AIPage /> : <Navigate to="/login" />, // Fixed condition
      
    },
    {
      path: "/admin",
      element: user?.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />,
    }
    
  ]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated ,user, setUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;