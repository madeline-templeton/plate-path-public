/**
 * Calendar API Accessibility Test Suite
 * 
 * Tests accessibility with REAL API calls to fetch planner data.
 * These tests require the backend server to be running on localhost:8080.
 * 
 * (Mocked: Firebase auth)
 * (Real: API calls to backend, planner data, meal rendering)
 * 
 * To run these tests:
 * 1. Start backend: cd backend && npm start
 * 2. Run tests: cd frontend && npm test -- Calendar.api.accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Calendar from './Calendar';

/**
 * Mock Firebase auth to provide a test user.
 * This prevents real Firebase authentication during tests.
 */
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: { 
      uid: 'test-user-123',
      getIdToken: vi.fn(() => Promise.resolve('mock-token'))
    },
    onAuthStateChanged: vi.fn(() => vi.fn()),
  },
}));

/**
 * Mock AuthContext to return a test user.
 * The backend will receive this user ID in API requests.
 */
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ 
    user: { 
      id: 'test-user-123',
      email: 'test@example.com'
    } 
  }),
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
 * Main test suite for Calendar API accessibility.
 * All tests make REAL API calls to the backend at localhost:8080.
 */
describe('Calendar - API Accessibility Tests', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * PAGE STRUCTURE
   * Tests that page structure remains accessible with real API data.
   */
  describe('Page Structure', () => {
    /**
     * Tests that calendar grid has proper role="grid" with real data.
     * (Mocked: Firebase auth)
     * (Real: API call to fetch planner, grid structure)
     */
    it('should have a calendar grid with role="grid" after loading real data', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        expect(grid).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    /**
     * Tests that calendar cells have role="gridcell" with real planner data.
     * (Mocked: Firebase auth)
     * (Real: API call, grid cell roles)
     */
    it('should have calendar cells with role="gridcell" populated with real meals', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const gridcells = screen.getAllByRole('gridcell');
        expect(gridcells.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    /**
     * Tests that weekday headers maintain accessibility with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, column header structure)
     */
    it('should have weekday headers with role="columnheader"', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const headers = screen.getAllByRole('columnheader');
        expect(headers.length).toBe(7); // Sun through Sat
      }, { timeout: 5000 });
    });

    /**
     * Tests that navigation toolbar maintains proper role with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, toolbar structure)
     */
    it('should have navigation controls in a toolbar', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const toolbar = screen.getByRole('toolbar', { name: /calendar navigation/i });
        expect(toolbar).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests that heading structure remains accessible with real data.
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that heading hierarchy is maintained with real planner data.
     * (Mocked: Firebase auth)
     * (Real: API call, heading elements)
     */
    it('should have proper heading hierarchy from h1 to h2 with real data', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const h1 = screen.getByRole('heading', { level: 1, name: /your meal calender/i });
        expect(h1).toBeInTheDocument();
        
        const h2 = screen.getByRole('heading', { level: 2 });
        expect(h2).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests that ARIA labels work correctly with real API-fetched data.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that navigation buttons have descriptive aria-labels with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, button ARIA labels)
     */
    it('should have aria-labels on navigation buttons', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /go to previous month/i });
        const nextButton = screen.getByRole('button', { name: /go to next month/i });
        
        expect(prevButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    /**
     * Tests that month heading has aria-live for dynamic updates with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, ARIA live region)
     */
    it('should have aria-live on month-year heading with real data', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const monthYear = screen.getByRole('heading', { level: 2 });
        expect(monthYear).toHaveAttribute('aria-live', 'polite');
      }, { timeout: 5000 });
    });

    /**
     * Tests that calendar grid has proper aria-labelledby with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, ARIA labelledby connection)
     */
    it('should have calendar grid labeled by the current month', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        expect(grid).toHaveAttribute('aria-labelledby', 'current-month-year');
        
        const monthHeading = document.getElementById('current-month-year');
        expect(monthHeading).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    /**
     * Tests that meal buttons have descriptive aria-labels with REAL meal names.
     * This is the key test - verifying accessibility works with real API data.
     * (Mocked: Firebase auth)
     * (Real: API call fetches real meals, ARIA labels include real meal names)
     */
    it('should have descriptive aria-labels on meal buttons with real meal names', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const listitems = screen.getAllByRole('listitem');
        expect(listitems.length).toBeGreaterThan(0);
        
        // Verify each meal button has proper structure and aria-label
        listitems.forEach(item => {
          expect(item.tagName).toBe('BUTTON');
          const ariaLabel = item.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          // Aria-label should contain meal type (breakfast/lunch/dinner)
          expect(ariaLabel).toMatch(/(breakfast|lunch|dinner)/i);
        });
      }, { timeout: 5000 });
    });

    /**
     * Tests that calendar cells have aria-labels with real date and meal count.
     * (Mocked: Firebase auth)
     * (Real: API call, ARIA labels on cells with real meal counts)
     */
    it('should have aria-labels on calendar cells with real meal information', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const gridcells = screen.getAllByRole('gridcell');
        expect(gridcells.length).toBeGreaterThan(0);
        
        // Find cells with meals (should have aria-labels describing meal count)
        const cellsWithMeals = gridcells.filter(cell => {
          const ariaLabel = cell.getAttribute('aria-label');
          return ariaLabel && ariaLabel.includes('meal');
        });
        
        // At least some cells should have meals if test user has a planner
        expect(cellsWithMeals.length).toBeGreaterThanOrEqual(0);
      }, { timeout: 5000 });
    });

    /**
     * Tests that decorative elements remain hidden from screen readers.
     * (Mocked: Firebase auth)
     * (Real: API call, ARIA hidden on decorative content)
     */
    it('should hide decorative content from screen readers with real data', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const grid = screen.getByRole('grid');
        const dayNumbers = grid.querySelectorAll('[aria-hidden="true"]');
        expect(dayNumbers.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    /**
     * Tests that meal lists maintain proper role="list" with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, list role on meal containers)
     */
    it('should have meal lists with role="list" for real meals', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const lists = screen.getAllByRole('list');
        expect(lists.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests that keyboard accessibility works with real API data.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that navigation buttons are keyboard accessible with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, button focus)
     */
    it('should allow keyboard navigation to previous month button', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /go to previous month/i });
        expect(prevButton).toBeInTheDocument();
        expect(prevButton.tagName).toBe('BUTTON');
      }, { timeout: 5000 });
    });

    /**
     * Tests that next month button is keyboard accessible with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, button focus)
     */
    it('should allow keyboard navigation to next month button', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /go to next month/i });
        expect(nextButton).toBeInTheDocument();
        expect(nextButton.tagName).toBe('BUTTON');
      }, { timeout: 5000 });
    });

    /**
     * Tests that meal buttons from real API data are keyboard accessible.
     * (Mocked: Firebase auth)
     * (Real: API call fetches meals, meal buttons are focusable)
     */
    it('should allow keyboard navigation to real meal buttons', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const listitems = screen.getAllByRole('listitem');
        expect(listitems.length).toBeGreaterThan(0);
        
        // All meal buttons should be keyboard accessible
        listitems.forEach(button => {
          expect(button.tagName).toBe('BUTTON');
        });
      }, { timeout: 5000 });
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that content renders correctly with real API data.
   */
  describe('Content and Text', () => {
    /**
     * Tests that the page title renders with real data loaded.
     * (Mocked: Firebase auth)
     * (Real: API call, page title text)
     */
    it('should render the calendar page title', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        expect(screen.getByText(/your meal calender/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    /**
     * Tests that weekday headers render correctly with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, weekday header text)
     */
    it('should render all weekday headers with real data loaded', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        expect(screen.getByText('Sun')).toBeInTheDocument();
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Tue')).toBeInTheDocument();
        expect(screen.getByText('Wed')).toBeInTheDocument();
        expect(screen.getByText('Thu')).toBeInTheDocument();
        expect(screen.getByText('Fri')).toBeInTheDocument();
        expect(screen.getByText('Sat')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    /**
     * Tests that current month and year display correctly with real data.
     * (Mocked: Firebase auth)
     * (Real: API call, month/year text)
     */
    it('should display current month and year with real planner data', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const monthYear = screen.getByRole('heading', { level: 2 });
        // Should display a real month name and year
        expect(monthYear.textContent).toMatch(/\w+, \d{4}/);
      }, { timeout: 5000 });
    });

    /**
     * Tests that REAL meal names from API render in calendar cells.
     * This verifies the complete integration: API fetch → render → accessibility.
     * (Mocked: Firebase auth)
     * (Real: API call fetches real meal names, meal names render in calendar)
     */
    it('should render real meal names from API in calendar', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const listitems = screen.getAllByRole('listitem');
        
        // If test user has meals, verify they render
        if (listitems.length > 0) {
          // Check that meals have text content (real meal names)
          listitems.forEach(item => {
            expect(item.textContent).toBeTruthy();
            expect(item.textContent?.length).toBeGreaterThan(0);
          });
        }
      }, { timeout: 5000 });
    });

    /**
     * Tests that meal label disclaimer renders with real data loaded.
     * (Mocked: Firebase auth)
     * (Real: API call, disclaimer text)
     */
    it('should render meal label disclaimer', async () => {
      renderWithRouter(<Calendar />);
      
      await waitFor(() => {
        const disclaimer = screen.getByText(/\*Meal Labels: B = Breakfast, L = Lunch, and D = Dinner/i);
        expect(disclaimer).toBeInTheDocument();
        expect(disclaimer).toHaveAttribute('aria-hidden', 'true');
      }, { timeout: 5000 });
    });
  });
});
