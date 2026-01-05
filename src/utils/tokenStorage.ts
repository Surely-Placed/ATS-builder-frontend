// Token storage utility for Safari compatibility
// Stores JWT token as fallback when cookies fail

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  /**
   * Store authentication token
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      // localStorage might be disabled or full - silently fail
    }
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      // Ignore errors
    }
  },

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
};

