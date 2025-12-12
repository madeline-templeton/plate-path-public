/**
 * Calendar Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the Calendar page component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Calendar from './Calendar';
import type { Planner } from './Calendar';

// Mock AuthContext to return an authenticated user
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ 
    user: { 
      id: 'test-user-123',
      email: 'test@example.com'
    } 
  }),
}));

// Mock Firebase auth service to prevent real Firebase initialization
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: { uid: 'test-user-123' },
    onAuthStateChanged: vi.fn(() => vi.fn()),
  },
}));

// Mock axios to prevent real HTTP requests
vi.mock('axios', () => ({
  default: {
    get: vi.fn((url: string) => {
      // Mock planner data response
      if (url.includes('/getPlannerForUser/')) {
        return Promise.resolve({
          data: {
            success: true,
            planner: mockPlanner,
          },
        });
      }
      // Mock consent data response
      if (url.includes('/getUserConsent/')) {
        return Promise.resolve({
          data: {
            success: true,
            exists: true,
            generalConsent: 'granted',
          },
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }),
  },
}));

// Mock planner data with meals
const mockPlanner: Planner = {
  userId: 'test-user-123',
  startDate: {
    day: '1',
    month: '12',
    year: '2025',
  },
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
 * Main test suite for Calendar accessibility.
 * All tests use MOCKED backend/auth but test REAL page HTML and ARIA attributes.
 */
describe('Calendar - Accessibility Tests', () => {

  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * PAGE STRUCTURE
   * Tests for HTML structure and landmark regions.
   */
  describe('Page Structure', () => {
    /**
     * Tests that calendar grid has proper role="grid" for screen readers.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Grid role attribute)
     */
    it('should have a calendar grid with role="grid"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        expect(grid).toBeInTheDocument();
      });
    });

    /**
     * Tests that calendar cells have role="gridcell" for proper navigation.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Grid cell roles)
     */
    it('should have calendar cells with role="gridcell"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const gridcells = screen.getAllByRole('gridcell');
        expect(gridcells.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that weekday headers have role="columnheader".
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Column header roles)
     */
    it('should have weekday headers with role="columnheader"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const headers = screen.getAllByRole('columnheader');
        expect(headers.length).toBe(7); // Sun through Sat
      });
    });

    /**
     * Tests that navigation toolbar has proper role="toolbar".
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Toolbar role)
     */
    it('should have navigation controls in a toolbar', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const toolbar = screen.getByRole('toolbar', { name: /calendar navigation/i });
        expect(toolbar).toBeInTheDocument();
      });
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests for proper heading structure (h1 → h2).
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that heading hierarchy follows h1 → h2 pattern.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Heading levels)
     */
    it('should have proper heading hierarchy from h1 to h2', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const h1 = screen.getByRole('heading', { level: 1, name: /your meal calender/i });
        expect(h1).toBeInTheDocument();
        
        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2).toBeInTheDocument();
      });
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper ARIA labels and descriptions.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that navigation buttons have descriptive aria-labels.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labels on buttons)
     */
    it('should have aria-labels on navigation buttons', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /go to previous month/i });
        const nextButton = screen.getByRole('button', { name: /go to next month/i });
        
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
      });
    });

    /**
     * Tests that current month heading has aria-live for dynamic updates.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA live region)
     */
    it('should have aria-live on month-year heading for dynamic updates', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const monthYear = screen.getByRole('heading', { level: 2 });
        expect(monthYear).toHaveAttribute('aria-live', 'polite');
      });
    });

    /**
     * Tests that calendar grid has aria-labelledby connecting to month heading.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labelledby attribute)
     */
    it('should have calendar grid labeled by the current month', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        expect(grid).toHaveAttribute('aria-labelledby', 'current-month-year');
        
        const monthHeading = document.getElementById('current-month-year');
        expect(monthHeading).toBeInTheDocument();
      });
    });

    /**
     * Tests that meal buttons have descriptive aria-labels with meal name and type.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labels on meal buttons)
     */
    it('should have descriptive aria-labels on meal buttons', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        // Check that meal list items exist (buttons with meal data)
        const listitems = screen.getAllByRole('listitem');
        expect(listitems.length).toBeGreaterThan(0);
        
        // Verify they are buttons with aria-labels
        listitems.forEach(item => {
          expect(item.tagName).toBe('BUTTON');
          expect(item.getAttribute('aria-label')).toBeTruthy();
        });
      });
    });

    /**
     * Tests that calendar cells have aria-labels describing the date and meal count.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labels on grid cells)
     */
    it('should have aria-labels on calendar cells with date information', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const cellWithMeals = screen.getByRole('gridcell', { name: /december 1, 2025, 3 meals planned/i });
        expect(cellWithMeals).toBeInTheDocument();
      });
    });

    /**
     * Tests that decorative elements have aria-hidden="true".
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA hidden on decorative content)
     */
    it('should hide decorative content from screen readers', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        const dayNumbers = grid.querySelectorAll('[aria-hidden="true"]');
        expect(dayNumbers.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that meal list has role="list" for proper structure.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: List role on meals container)
     */
    it('should have meal lists with role="list"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const lists = screen.getAllByRole('list');
        expect(lists.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that individual meals have role="listitem".
     * (Mocked: Auth, Firebase, Axios)
     * (Real: List item roles on meal buttons)
     */
    it('should have meal items with role="listitem"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const listitems = screen.getAllByRole('listitem');
        expect(listitems.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that navigation buttons are keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button focus and keyboard interaction)
     */
    it('should allow keyboard navigation to previous month button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /go to previous month/i });
        expect(prevButton).toBeInTheDocument();
      });

      const prevButton = screen.getByRole('button', { name: /go to previous month/i });
      await user.tab();
      
      // Button should be focusable
      expect(prevButton.tagName).toBe('BUTTON');
    });

    /**
     * Tests that next month button is keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button focus)
     */
    it('should allow keyboard navigation to next month button', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /go to next month/i });
        expect(nextButton).toBeInTheDocument();
        expect(nextButton.tagName).toBe('BUTTON');
      });
    });

    /**
     * Tests that meal buttons are keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button elements can receive focus)
     */
    it('should allow keyboard navigation to meal buttons', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        // Check that meal buttons exist as listitems
        const listitems = screen.getAllByRole('listitem');
        expect(listitems.length).toBeGreaterThan(0);
        
        // All should be button elements (keyboard accessible)
        listitems.forEach(button => {
          expect(button.tagName).toBe('BUTTON');
        });
      });
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that content renders correctly for screen readers.
   */
  describe('Content and Text', () => {
    /**
     * Tests that the page title renders correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render the calendar page title', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        expect(screen.getByText(/your meal calender/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that weekday headers render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content in headers)
     */
    it('should render all weekday headers', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        expect(screen.getByText('Sun')).toBeInTheDocument();
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Tue')).toBeInTheDocument();
        expect(screen.getByText('Wed')).toBeInTheDocument();
        expect(screen.getByText('Thu')).toBeInTheDocument();
        expect(screen.getByText('Fri')).toBeInTheDocument();
        expect(screen.getByText('Sat')).toBeInTheDocument();
      });
    });

    /**
     * Tests that current month and year display correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Month and year text)
     */
    it('should display current month and year', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const monthYear = screen.getByRole('heading', { level: 2 });
        expect(monthYear.textContent).toMatch(/December, 2025/i);
      });
    });

    /**
     * Tests that meal names render in calendar cells.
     * (Mocked: Auth, Firebase, Axios with sample planner data)
     * (Real: Meal name text content)
     */
    it('should render meal names in calendar', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        expect(screen.getByText(/Scrambled Eggs/i)).toBeInTheDocument();
        expect(screen.getByText(/Caesar Salad/i)).toBeInTheDocument();
        expect(screen.getByText(/Grilled Chicken/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that meal label disclaimer renders with aria-hidden.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Disclaimer text)
     */
    it('should render meal label disclaimer', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const disclaimer = screen.getByText(/\*Meal Labels: B = Breakfast, L = Lunch, and D = Dinner/i);
        expect(disclaimer).toBeInTheDocument();
        expect(disclaimer).toHaveAttribute('aria-hidden', 'true');
      });
    });

    /**
     * Tests that navigation arrows render as text content.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Arrow symbols)
     */
    it('should render navigation arrow symbols', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /go to previous month/i });
        const nextButton = screen.getByRole('button', { name: /go to next month/i });
        
        expect(prevButton.textContent).toContain('←');
        expect(nextButton.textContent).toContain('→');
      });
    });
  });
});
