import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { trackLogin, trackSignup, trackLogout } from "../utils/analytics";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://api.jobrabbit.ai/api";

export const authService = {
  async signup(name: string, email: string, password: string) {
    throw new Error("Email/password signup is disabled. Please use Google sign-in.");
  },

  async login(email: string, password: string) {
    throw new Error("Email/password login is disabled. Please use Google sign-in.");
  },

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Log token for Postman (e.g. copy into Authorization header)
      auth.currentUser?.getIdToken(false).then((token) => {
        console.log("FIREBASE_TOKEN_FOR_POSTMAN:", token);
      });
      const firebaseToken = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/auth/firebase`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_token: firebaseToken }),
      });


      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google sign-in failed");

      // Track Google sign-in event (could be login or signup)
      trackLogin("google");

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async resetPassword(email: string) {
    throw new Error("Password reset via email is disabled. Please use Google sign-in.");
  },

  async resendVerificationEmail() {
    throw new Error("Email verification flow is disabled for direct email/password. Please use Google sign-in.");
  },

  async logout() {
    try {
      await signOut(auth);
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Track logout event
      trackLogout();

      return { message: "Logout successful" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
