import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await axios.post("http://localhost:8000/auth/login", { email, password });
      const response = await axios.get("http://localhost:8000/users/me");
      setUser(response.data);
      setError(null);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
      });
      setError(null);
      return true;
    } catch (err) {
      setError("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout");
      setUser(null);
      setError(null);
      navigate("/");
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
