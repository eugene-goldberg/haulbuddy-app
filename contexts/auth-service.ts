import { auth, db } from '../firebase';
import { UserRole } from './AuthContext';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

// Interface for user registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Interface for login data
export interface LoginData {
  email: string;
  password: string;
}

// Register a new user
export const registerUser = async ({ name, email, password, role = 'user' }: RegisterData) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    if (user) {
      await updateProfile(user, {
        displayName: name
      });
      
      // Create a user document in Firestore
      const userRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userRef, {
        name,
        email,
        role,
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    // Handle specific Firebase auth errors
    if (errorCode === 'auth/email-already-in-use') {
      throw new Error('Email already in use. Please try a different email.');
    } else if (errorCode === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else {
      throw new Error(errorMessage);
    }
  }
};

// Login with email and password
export const loginWithEmail = async ({ email, password }: LoginData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    const errorCode = error.code;
    
    // Handle specific Firebase auth errors
    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      throw new Error('Invalid email or password.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else if (errorCode === 'auth/user-disabled') {
      throw new Error('This account has been disabled.');
    } else if (errorCode === 'auth/too-many-requests') {
      throw new Error('Too many failed login attempts. Please try again later.');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
};

// Send password reset email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    
    if (errorCode === 'auth/user-not-found') {
      throw new Error('No user found with this email address.');
    } else if (errorCode === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else {
      throw new Error('Failed to send password reset email. Please try again.');
    }
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    throw new Error('Failed to sign out. Please try again.');
  }
};