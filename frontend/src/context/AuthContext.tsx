import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserFromToken,JwtPayload } from '../types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  currentUser: UserFromToken | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserFromToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('selectedRole');
    if (storedUser) {
      const parsedUser: UserFromToken = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      console.log("curreent user exist and set to", parsedUser)
      setIsAuthenticated(true);
      setRole(storedRole || (parsedUser.role.length === 1 ? parsedUser.role[0] : null));
    }
  }, []);

  const setCurrentRole =(selectedRole: string) => {
    setRole(selectedRole);
    localStorage.setItem('selectedRole', selectedRole);
    console.log("role updated in context to ", selectedRole)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(email, password)
    try {
      const res = await fetch('http://localhost:8086/api/users/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      if (!res.ok) return false;

      const { token } = await res.json();
      console.log(token)
      const decoded: JwtPayload = jwtDecode(token);

      const user: UserFromToken = {
        email: decoded.sub,
        role: decoded.roles,
        token,
      };

      setCurrentUser(user);
      setIsAuthenticated(true);


      if (user.role.length === 1) {
        setRole(user.role[0]);
        localStorage.setItem('selectedRole', user.role[0]);
        console.log("selected role set to", user.role[0]);
      } else {
        setRole(null);
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      if (user.role.length === 1) {
        localStorage.setItem('selectedRole', user.role[0]);
        console.log("selected role set to", user.role[0])
      }


      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);


      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };


   const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, role, login, logout ,setCurrentRole}}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};