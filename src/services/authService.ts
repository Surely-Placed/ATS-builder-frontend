import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { trackLogin, trackSignup, trackLogout } from '../utils/analytics';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api';

export const authService = {
  async signup(name: string, email: string, password: string) {
    try {
      // Validate inputs
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }
      if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        throw new Error('Password must contain uppercase, lowercase, and number');
      }

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Send verification email
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false
      });

      // Force sign out until email is verified
      await signOut(auth);

      // Track signup event (email signup)
      trackSignup('email');

      return {
        success: true,
        message: 'Signup successful! Please check your email to verify your account.',
        requiresVerification: true
      };
    } catch (error: any) {
      // Handle Firebase errors
      const errorCode = error.code;
      let errorMessage = error.message;

      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Use at least 8 characters with mixed case and numbers.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password signup is disabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = errorMessage || 'Signup failed. Please try again.';
      }

      throw new Error(errorMessage);
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error('EMAIL_NOT_VERIFIED');
      }

      const firebaseToken = await user.getIdToken();
      
      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_token: firebaseToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      // Track login event
      trackLogin('email');
      
      return data;
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }
      throw new Error(error.message);
    }
  },

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      
      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_token: firebaseToken })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google sign-in failed');
      
      // Track Google sign-in event (could be login or signup)
      trackLogin('google');
      
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Password reset email sent' };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      await sendEmailVerification(user, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false
      });
      
      return { 
        success: true, 
        message: 'Verification email sent! Check your inbox.' 
      };
    } catch (error: any) {
      throw new Error('Failed to send verification email. Please try again.');
    }
  },

  async logout() {
    try {
      await signOut(auth);
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      // Track logout event
      trackLogout();
      
      return { message: 'Logout successful' };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
};

