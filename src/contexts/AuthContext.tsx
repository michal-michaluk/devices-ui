
import { createContext, useContext, useState, useEffect } from "react";

// Types for user roles
export type UserRole = "customer_service" | "engineer" | "service_provider" | "owner" | "end_consumer";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data (will be replaced with Firebase JWT authentication)
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "engineer" as UserRole,
    tenantId: "tenant1"
  },
  {
    id: "2",
    email: "service@example.com",
    password: "password123",
    name: "Service Provider",
    role: "service_provider" as UserRole,
    tenantId: "tenant1"
  },
  {
    id: "3",
    email: "consumer@example.com",
    password: "password123",
    name: "End Consumer",
    role: "end_consumer" as UserRole,
    tenantId: "tenant2"
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function (will be replaced with Firebase authentication)
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }
    
    // Remove password before storing
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store user in state and localStorage
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
