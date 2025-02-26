import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import RootPage from './pages/Root/RootPage';
import MessagingPage from "./pages/Message/MessagingPage";
import ChannelsPage from "./pages/Channel/ChannelsPage";
import { useEffect, useState, createContext, useContext } from "react";
// ... existing imports ...

// Create an auth context
export const AuthContext = createContext(null);

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
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
    {
      path: "/direct-message",
      element: isAuthenticated ? <MessagingPage /> : <Navigate to="/login" />,
    },
    {
      path: "/channels",
      element: isAuthenticated ? <ChannelsPage /> : <Navigate to="/login" />,
    },
  ]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
