import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from './auth-service';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection } from 'firebase/firestore';

// Define user roles
export type UserRole = 'user' | 'owner' | 'admin';

// Define our auth context state
interface AuthContextState {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
}

// Define the shape of our context
interface AuthContextValue extends AuthContextState {
  refreshUserRole: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextValue>({
  user: null,
  userRole: null,
  isLoading: true,
  refreshUserRole: async () => {},
  logout: async () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthContextState>({
    user: null,
    userRole: null,
    isLoading: true,
  });

  // Function to fetch user role from Firestore
  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const userRef = doc(collection(db, 'users'), userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData?.role as UserRole || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  // Function to refresh user role
  const refreshUserRole = async () => {
    if (state.user) {
      const role = await fetchUserRole(state.user.uid);
      setState(prevState => ({
        ...prevState,
        userRole: role
      }));
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const role = await fetchUserRole(user.uid);
        setState({
          user,
          userRole: role,
          isLoading: false,
        });
      } else {
        // User is signed out
        setState({
          user: null,
          userRole: null,
          isLoading: false,
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Function to log user out
  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process');
      await signOut();
      
      // Force state update - don't rely only on the listener
      console.log('AuthContext: Manually updating state to logged out');
      setState({
        user: null,
        userRole: null,
        isLoading: false,
      });
      
      console.log('AuthContext: Logout complete');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        refreshUserRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}