import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import App from '../App';

// Mock Firebase Auth
vi.mock('../config/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      // Simulate auth state change
      callback(null);
      // Return unsubscribe function
      return vi.fn();
    }),
  },
}));

// Mock Firebase Auth Service
vi.mock('../services/authService', () => ({
  authService: {
    signup: vi.fn(),
    login: vi.fn(),
    googleSignIn: vi.fn(),
    logout: vi.fn(),
    resetPassword: vi.fn(),
    resendVerificationEmail: vi.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    // App already includes BrowserRouter, so we don't need to wrap it
    const { container } = render(<App />);
    
    // Wait for async auth state to resolve
    await waitFor(() => {
      expect(container).toBeTruthy();
    }, { timeout: 3000 });
    
    // Add more specific tests as needed
  });
});

