/**
 * GeneratePlan Functional Test Suite
 *
 * Tests component behavior, user interactions, form validation, navigation, and API integration
 * for the GeneratePlan page component with mocked dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GeneratePlan from './GeneratePlan';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios to prevent real HTTP requests so API calls to /generate and /getUserInformation are intercepted and don't hit the backend.
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

// Mock React Router navigation that intercepts navigation calls so we can verify they were called with correct routes.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
 * Main test suite for GeneratePlan functional behavior.
 * All tests use MOCKED backend/auth but test REAL component logic, user interactions, and UI state.
 */
describe('GeneratePlan - Functional Tests', () => {

   // Reset all mocks and clear localStorage before each test to ensure clean state and prevents tests from affecting each other.
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (axios.post as any).mockResolvedValue({ data: { success: true, planner: mockPlanner } });
    (axios.get as any).mockResolvedValue({ data: { success: true, userInfo: mockUserInfo } });
  });

  /**
   * CONTENT RENDERING
   * Tests for content rendering and text accuracy.
   * Confirms: All static page content (headers, form fields, labels, and hints) renders correctly.
   */
  describe('Content Rendering', () => {
    /**
     * Tests that the main header and form are rendered.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content rendering, form presence)
     */
    it('should render the main header and form', () => {
      renderWithRouter(<GeneratePlan />);
      expect(screen.getByText(/Generate Your Plan/i)).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
    /**
     * Tests that all required form fields are rendered.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Form field rendering)
     */
    it('should render all required form fields', () => {
      renderWithRouter(<GeneratePlan />);
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Sex/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Activity Level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plan Duration/i)).toBeInTheDocument();
    });
    /**
     * Tests that the required field disclaimer is rendered.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Disclaimer rendering)
     */
    it('should render the required field disclaimer', () => {
      renderWithRouter(<GeneratePlan />);
      expect(screen.getByText(/indicates a required field/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests for form validation and user input.
   * Confirms: Validation errors are shown for missing or invalid input.
   */
  describe('Form Validation', () => {
    /**
     * Tests that validation errors are shown when submitting an empty form.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Form validation, error message rendering)
     */
    it('should show validation errors when submitting empty form', async () => {
      renderWithRouter(<GeneratePlan />);
      const submitBtn = screen.getByRole('button', { name: /generate/i });
      await userEvent.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });
    /**
     * Tests that an error is shown for invalid age input.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Form validation, error message rendering)
     */
    it('should show error for invalid age', async () => {
      renderWithRouter(<GeneratePlan />);
      const ageInput = screen.getByLabelText(/Age/i);
      await userEvent.clear(ageInput);
      await userEvent.type(ageInput, '10');
      const submitBtn = screen.getByRole('button', { name: /generate/i });
      await userEvent.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText(/too low/i)).toBeInTheDocument();
      });
    });
  });

  /**
   * Tests for navigation functionality.
   * Confirms: Navigation to other pages works via links or buttons.
   */
  describe('Navigation Functionality', () => {
    /**
     * Tests that navigation to the calendar page occurs after successful plan generation.
     * (Mocked: Auth, Firebase, Axios, React Router)
     * (Real: Navigation, form submission)
     */
    it('should navigate to calendar page after successful plan generation', async () => {
      renderWithRouter(<GeneratePlan />);
      // Fill required fields (simulate minimal valid input)
      await userEvent.type(screen.getByLabelText(/Age/i), '20');
      await userEvent.type(screen.getByLabelText(/Weight/i), '150');
      await userEvent.selectOptions(screen.getByLabelText(/Sex/i), 'male');
      await userEvent.selectOptions(screen.getByLabelText(/Activity Level/i), 'moderate');
      await userEvent.selectOptions(screen.getByLabelText(/Plan Duration/i), '1');
      const submitBtn = screen.getByRole('button', { name: /generate/i });
      await userEvent.click(submitBtn);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/calendar', expect.anything());
      });
    });
  });

  /**
   * Tests for loading and error states.
   * Confirms: Loading message and error messages are shown appropriately.
   */
  describe('Loading and Error States', () => {
    /**
     * Tests that the loading message is shown when loading.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Loading state rendering)
     */
    it('should show loading message when loading', () => {
      renderWithRouter(<GeneratePlan />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    /**
     * Tests that an error message is shown if the API call fails.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Error state rendering)
     */
    it('should show error message if API call fails', async () => {
      (axios.post as any).mockRejectedValueOnce(new Error('Server error'));
      renderWithRouter(<GeneratePlan />);
      // Fill required fields (simulate minimal valid input)
      await userEvent.type(screen.getByLabelText(/Age/i), '20');
      await userEvent.type(screen.getByLabelText(/Weight/i), '150');
      await userEvent.selectOptions(screen.getByLabelText(/Sex/i), 'male');
      await userEvent.selectOptions(screen.getByLabelText(/Activity Level/i), 'moderate');
      await userEvent.selectOptions(screen.getByLabelText(/Plan Duration/i), '1');
      const submitBtn = screen.getByRole('button', { name: /generate/i });
      await userEvent.click(submitBtn);
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});

/**
 * MOCK PLANNER AND USER INFO DATA
 * Used for rendering and form population in tests.
 */
const mockPlanner = {
  userId: 'test-user-123',
  startDate: { day: '1', month: '12', year: '2025' },
  weeks: 1,
  meals: [],
};
const mockUserInfo = {
  age: '20',
  sex: 'male',
  height: { value: ['5', '8'], unit: 'ft-in' },
  weight: { value: '150', unit: 'lb' },
  activityLevel: 'moderate',
  weightGoal: 'maintain',
  dietaryRestrictions: [],
  weeks: 1,
  startDate: { day: '1', month: '12', year: '2025' },
};
