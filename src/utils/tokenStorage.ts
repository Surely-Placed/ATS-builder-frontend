// DEPRECATED: tokenStorage removed. Frontend uses cookie-only httpOnly auth.
// This module remains as a no-op placeholder to surface accidental imports during migration.
export const tokenStorage = {
  setToken(): void {
    throw new Error('tokenStorage.setToken is removed. Use cookie-based auth only.');
  },
  getToken(): string | null {
    return null;
  },
  removeToken(): void {
    throw new Error('tokenStorage.removeToken is removed. Use cookie-based auth only.');
  },
  hasToken(): boolean {
    return false;
  },
};
