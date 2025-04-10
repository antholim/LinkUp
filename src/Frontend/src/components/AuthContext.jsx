import { createContext, useContext, useEffect, useState } from 'react';
import { fetchingService } from '../services/fetchingService';

import PropTypes from 'prop-types';


export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const authenticate = async () => {
      try {
        if (token) {
          const response = await fetchingService.post(
            "/authenticate",
            { accessToken: token },
            {},
            true
          );
          if (response?.status === 200) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
          console.log(response.data.user, "HERE")
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

