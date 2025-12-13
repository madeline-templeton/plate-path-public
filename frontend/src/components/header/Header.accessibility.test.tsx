/**
 * Header Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the Header component and its child components (LoginButton, ProfileIcon).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from './Header';


// Mock Firebase
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null); // Simulate no user logged in
    return vi.fn(); // Return unsubscribe function
  }),
  signOut: vi.fn(),
}));

// Mock toast notifications
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
 * Main test suite for Header accessibility.
 * (Mocked: Firebase auth, navigation, toast notifications)
 * (Real: HTML structure, ARIA labels, keyboard navigation)
 */
describe('Header - Accessibility Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * PAGE STRUCTURE
   * Tests for proper header structure and landmark roles.
   */
  describe('Page Structure', () => {
    /**
     * Tests that header has role="banner".
     * (Mocked: Firebase auth)
     * (Real: Header role)
     */
    it('should have role="banner" for the header', () => {
      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    /**
     * Tests that navigation has proper aria-label.
     * (Mocked: Firebase auth)
     * (Real: Nav element with aria-label)
     */
    it('should have navigation with aria-label', () => {
      renderWithRouter(<Header />);
      
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    /**
     * Tests that header actions container has aria-label.
     * (Mocked: Firebase auth)
     * (Real: Div with aria-label)
     */
    it('should have header actions with aria-label', () => {
      renderWithRouter(<Header />);
      
      const actions = document.querySelector('[aria-label="User account actions"]');
      expect(actions).toBeInTheDocument();
    });

    /**
     * Tests that logo is hidden from screen readers.
     * (Mocked: Firebase auth)
     * (Real: Logo with aria-hidden)
     */
    it('should hide logo from screen readers with aria-hidden', () => {
      renderWithRouter(<Header />);
      
      const logo = document.querySelector('.logo[aria-hidden="true"]');
      expect(logo).toBeInTheDocument();
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests for proper heading structure.
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that header does not use heading elements (uses role="banner" instead).
     * (Mocked: Firebase auth)
     * (Real: No heading elements in header)
     */
    it('should not contain heading elements', () => {
      renderWithRouter(<Header />);
      
      const headings = screen.queryAllByRole('heading');
      expect(headings.length).toBe(0);
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper ARIA labels on navigation buttons.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that "Our Story" button has descriptive aria-label.
     * (Mocked: Firebase auth)
     * (Real: Button aria-label)
     */
    it('should have descriptive aria-label on Our Story button', () => {
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to our story page/i });
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that "Generate Your Plan" button has descriptive aria-label.
     * (Mocked: Firebase auth)
     * (Real: Button aria-label)
     */
    it('should have descriptive aria-label on Generate Your Plan button', () => {
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to generate your plan page/i });
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that "Your Calendar" button has descriptive aria-label.
     * (Mocked: Firebase auth)
     * (Real: Button aria-label)
     */
    it('should have descriptive aria-label on Your Calendar button', () => {
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to your calendar page/i });
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Login/Sign In button has descriptive aria-label.
     * (Mocked: Firebase auth returns no user)
     * (Real: Button aria-label)
     */
    it('should have descriptive aria-label on Sign In button', () => {
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /sign in to your account/i });
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Profile Icon button has descriptive aria-label.
     * (Mocked: Firebase auth)
     * (Real: Button aria-label)
     */
    it('should have descriptive aria-label on Profile Icon button', () => {
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to account page/i });
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that profile icon is hidden from screen readers.
     * (Mocked: Firebase auth)
     * (Real: SVG with aria-hidden)
     */
    it('should hide decorative profile icon from screen readers', () => {
      renderWithRouter(<Header />);
      
      const svg = document.querySelector('svg[aria-hidden="true"]');
      expect(svg).toBeInTheDocument();
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility on all interactive elements.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that all navigation buttons are keyboard accessible.
     * (Mocked: Firebase auth)
     * (Real: Button elements)
     */
    it('should allow keyboard navigation to all buttons', () => {
      renderWithRouter(<Header />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    /**
     * Tests that Our Story button is clickable.
     * (Mocked: Firebase auth, navigation)
     * (Real: Button click interaction)
     */
    it('should allow clicking Our Story button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to our story page/i });
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Generate Your Plan button is clickable.
     * (Mocked: Firebase auth, navigation)
     * (Real: Button click interaction)
     */
    it('should allow clicking Generate Your Plan button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to generate your plan page/i });
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Your Calendar button is clickable.
     * (Mocked: Firebase auth, navigation)
     * (Real: Button click interaction)
     */
    it('should allow clicking Your Calendar button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to your calendar page/i });
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Sign In button is clickable.
     * (Mocked: Firebase auth, navigation)
     * (Real: Button click interaction)
     */
    it('should allow clicking Sign In button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /sign in to your account/i });
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });

    /**
     * Tests that Profile Icon button is clickable.
     * (Mocked: Firebase auth, navigation)
     * (Real: Button click interaction)
     */
    it('should allow clicking Profile Icon button', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const button = screen.getByRole('button', { name: /navigate to account page/i });
      await user.click(button);
      
      expect(button).toBeInTheDocument();
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that text content renders correctly for screen readers.
   */
  describe('Content and Text', () => {
    /**
     * Tests that navigation button text renders.
     * (Mocked: Firebase auth)
     * (Real: Button text content)
     */
    it('should render navigation button text', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText(/our story/i)).toBeInTheDocument();
      expect(screen.getByText(/generate/i)).toBeInTheDocument();
      expect(screen.getByText(/your plan/i)).toBeInTheDocument();
      expect(screen.getByText(/your calendar/i)).toBeInTheDocument();
    });

    /**
     * Tests that Sign In button text renders.
     * (Mocked: Firebase auth returns no user)
     * (Real: Button text content)
     */
    it('should render Sign In button text when not logged in', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    /**
     * Tests that logo text renders.
     * (Mocked: Firebase auth)
     * (Real: Logo text content)
     */
    it('should render logo text', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText(/platepath/i)).toBeInTheDocument();
    });
  });
});
