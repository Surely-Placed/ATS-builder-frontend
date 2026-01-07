import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/firebase";
import { authService } from "../services/authService";
import { identifyUser, resetMixpanel, setUserProperties } from "../config/mixpanel";
import { tokenStorage } from "../utils/tokenStorage";
import { apiClient } from "../services/resumeApi";
import { analysisApiClient } from "../services/analysis/apiClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (name: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  resendVerificationEmail: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Initialize token in axios defaults on app load (Safari compatibility)
    const token = tokenStorage.getToken();
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      analysisApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
      delete analysisApiClient.defaults.headers.common["Authorization"];
    }

    // Listen to auth state changes - this will automatically restore the session
    // from localStorage if the user was previously logged in
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // ✅ Ensure token is set in axios defaults when user is authenticated
      if (firebaseUser) {
        const currentToken = tokenStorage.getToken();
        if (currentToken) {
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
          analysisApiClient.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
        }

        // Update Mixpanel when auth state changes
        identifyUser(firebaseUser.uid);
        setUserProperties({
          email: firebaseUser.email || undefined,
          name: firebaseUser.displayName || undefined,
        });
      } else {
        // Remove token from axios defaults on logout
        delete apiClient.defaults.headers.common["Authorization"];
        delete analysisApiClient.defaults.headers.common["Authorization"];
        resetMixpanel();
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const result = await authService.signup(name, email, password);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await authService.login(email, password);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const googleSignIn = async () => {
    try {
      setError(null);
      const result = await authService.googleSignIn();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      return await authService.resetPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setError(null);
      return await authService.resendVerificationEmail();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      // Remove token from axios defaults
      delete apiClient.defaults.headers.common["Authorization"];
      delete analysisApiClient.defaults.headers.common["Authorization"];
      // Reset Mixpanel on logout
      resetMixpanel();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        googleSignIn,
        resetPassword,
        resendVerificationEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
