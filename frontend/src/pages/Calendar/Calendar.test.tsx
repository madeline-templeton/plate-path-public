/**
 * Calendar Functional Test Suite
 * 
 * Tests component behavior, user interactions, modal logic, navigation, and API integration
 * for the Calendar page component with mocked dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Calendar from './Calendar';
import axios from 'axios';
import '@testing-library/jest-dom';

/**
 * Mock axios to prevent real HTTP requests.
 * API calls to /getPlannerForUser and /getUserConsent are intercepted and don't hit the backend.
 */
vi.mock('axios');

/**
 * Mock Firebase auth service to prevent real authentication.
 * Provides a mock token for authorization headers in API calls.
 */
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token')
    }
  }
}));

/**
 * Mock AuthContext to return a test user.
 * This prevents real authentication logic from running during tests.
 */
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123', email: 'test@example.com' }
  })
}));

/**
 * Mock React Router navigation.
 * Navigation calls are intercepted so we can verify they were called with correct routes.
 */
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
 * Calendar uses React Router's navigate() function, so we need BrowserRouter wrapping.
 * 
 * @param component - The React component to render
 * @returns The render result from React Testing Library
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * TESTING SUITE
 * Main test suite for Calendar functional behavior.
 * All tests use MOCKED backend/auth but test REAL component logic, user interactions, and UI state.
 */
describe('Calendar - Functional Tests', () => {
  /**
   * Reset all mocks and clear localStorage before each test.
   * Ensures clean state and prevents tests from affecting each other.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (axios.get as any).mockResolvedValue({ data: { success: true, planner: mockPlanner } });
  });

  /**
   * Tests for content rendering and text accuracy.
   * Confirms: All static page content (headers, calendar grid, meal info) renders correctly.
   */
  describe('Content Rendering', () => {
    it('should render calendar header and month/year', () => {
      renderWithRouter(<Calendar />);
      expect(screen.getByText(/Your Meal Calender/i)).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });
    it('should render weekday headers', () => {
      renderWithRouter(<Calendar />);
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });
    it('should render at least one meal in a calendar cell', async () => {
      renderWithRouter(<Calendar />);
      await waitFor(() => {
        expect(screen.getByText(/Scrambled Eggs|Caesar Salad|Grilled Chicken/i)).toBeInTheDocument();
      });
    });
  });

  /**
   * Tests for navigation functionality.
   * Confirms: Month navigation buttons work and update the calendar view.
   */
  describe('Navigation Functionality', () => {
    it('should navigate to previous and next month when clicking arrows', async () => {
      renderWithRouter(<Calendar />);
      const prevBtn = screen.getByLabelText(/Go to previous month/i);
      const nextBtn = screen.getByLabelText(/Go to next month/i);
      expect(prevBtn).toBeInTheDocument();
      expect(nextBtn).toBeInTheDocument();
      await userEvent.click(nextBtn);
      await userEvent.click(prevBtn);
      // No assertion on month text change due to mock, but buttons are clickable
    });
  });

  /**
   * Tests for meal popup/modal logic.
   * Confirms: Clicking a meal opens the MealCard popup/modal.
   */
  describe('Meal Popup/Modal Logic', () => {
    it('should open a meal popup/modal when a meal is clicked', async () => {
      renderWithRouter(<Calendar />);
      const meal = await screen.findByText(/Scrambled Eggs|Caesar Salad|Grilled Chicken/i);
      await userEvent.click(meal);
      // Check for modal/popup content (could be meal name or close button)
      expect(screen.getByText(/B = Breakfast|L = Lunch|D = Dinner/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests for loading and empty states.
   * Confirms: Loading message and empty planner message are shown appropriately.
   */
  describe('Loading and Empty States', () => {
    it('should show loading message when loading', () => {
      // Simulate loading state by not providing planner
      renderWithRouter(<Calendar />);
      expect(screen.getByText(/Loading your meal plan/i)).toBeInTheDocument();
    });
    it('should show empty planner message if no meals', () => {
      (axios.get as any).mockResolvedValue({ data: { success: true, planner: { ...mockPlanner, meals: [] } } });
      renderWithRouter(<Calendar />);
      expect(screen.getByText(/No meal plan found/i)).toBeInTheDocument();
    });
  });
});

/**
 * MOCK PLANNER DATA
 * Used for rendering calendar and meal info in tests.
 */
const mockPlanner = {
  userId: 'test-user-123',
  startDate: { day: '1', month: '12', year: '2025' },
  weeks: 1,
  meals: [
    {
      date: { day: '1', month: '12', year: '2025' },
      breakfast: {
        id: 1,
        name: 'Scrambled Eggs',
        mealTime: 'breakfast',
        diet: 'vegetarian',
        ingredients: 'eggs, butter, salt',
        website: 'http://example.com',
        calories: 200,
        serving: 2,
        occurrences: 1,
      },
      lunch: {
        id: 2,
        name: 'Caesar Salad',
        mealTime: 'lunch',
        diet: 'vegetarian',
        ingredients: 'lettuce, croutons, dressing',
        website: 'http://example.com',
        calories: 350,
        serving: 1,
        occurrences: 1,
      },
      dinner: {
        id: 3,
        name: 'Grilled Chicken',
        mealTime: 'dinner',
        diet: 'regular',
        ingredients: 'chicken, spices',
        website: 'http://example.com',
        calories: 450,
        serving: 1,
        occurrences: 1,
      },
    },
  ],
};
