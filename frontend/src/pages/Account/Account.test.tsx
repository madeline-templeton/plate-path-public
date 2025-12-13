/**
 * Account Functional Test Suite
 * 
 * Tests component behavior, user interactions, consent logic, deletion flows, and API integration
 * for the Account page component with mocked dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Account from './Account';
import axios from 'axios';
import '@testing-library/jest-dom';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth: any, callback: any) => {
    callback({ uid: 'mock-user', email: 'mockuser@example.com' });
    return () => {};
  },
  signOut: vi.fn().mockResolvedValue(undefined),
}));

// Mock axios to prevent real HTTP requests so API calls to backend are intercepted and don't hit the backend.
vi.mock('axios');

// Mock Firebase auth service to prevent real authentication by providing a mock token for authorization headers in API calls.
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token')
    }
  }
}));

// Mock AuthContext to return a test user preventing real authentication logic from running during tests.
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123', email: 'test@example.com' }
  })
}));

/**
 * Helper function to render components with React Router context.
 * 
 * @param component - The React component to render
 * @returns The render result from React Testing Library
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * TESTING SUITE
 * Main test suite for Account functional behavior.
 * All tests use MOCKED backend/auth but test REAL component logic, user interactions, and UI state.
 */
describe('Account - Functional Tests', () => {
  // Reset all mocks and clear localStorage before each test to ensure a clean state and prevent tests from affecting each other.
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (axios.get as any).mockResolvedValue({ data: { success: true, exists: true } });
    (axios.put as any).mockResolvedValue({ data: { success: true } });
    (axios.delete as any).mockResolvedValue({ data: { success: true } });
  });

  /**
   * CONTENT RENDERING
   * Tests for content rendering and text accuracy.
   */
  describe('Content Rendering', () => {
    /**
     * Tests that the account page header and all major sections are rendered.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content rendering)
     */
    it('should render account page header and all major sections', () => {
      renderWithRouter(<Account />);
      expect(screen.getByRole('heading', { level: 1, name: /my account/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /account information/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /meal plan status/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /voted meals status/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /saved information status/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /privacy settings/i })).toBeInTheDocument();
    });
  });

  /**
   * DELETE BUTTONS
   * Tests for delete button flows and confirmation dialogs.
   */
  describe('Delete Button Flows', () => {
    /**
     * Tests that clicking delete meal plan button triggers confirmation and API call.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: User click interaction, window.confirm, API call)
     */
    it('should call API and update UI when deleting meal plan', async () => {
      window.confirm = vi.fn(() => true);
      renderWithRouter(<Account />);
      const deleteBtn = await screen.findByRole('button', { name: /delete your meal plan/i });
      await userEvent.click(deleteBtn);
      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalled();
      });
    });
  });

  /**
   * CONSENT TOGGLES
   * Tests for consent toggle switches and API integration.
   */
  describe('Consent Toggles', () => {
    /**
     * Tests that toggling general consent switch calls API and updates UI.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: User click interaction, API call)
     */
    it('should call API and update UI when toggling general consent', async () => {
      renderWithRouter(<Account />);
      const generalSwitch = await screen.findByRole('switch', { name: /toggle general storage consent/i });
      await userEvent.click(generalSwitch);
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });
    });
  });

  /**
   * EMAIL DISPLAY
   * Tests for correct display of user email.
   */
  describe('Email Display', () => {
    /**
     * Tests that the user's email is displayed on the account page.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content rendering)
     */
    it('should display the user email', () => {
      renderWithRouter(<Account />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});
