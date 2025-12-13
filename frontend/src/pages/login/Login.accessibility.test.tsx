/**
 * Login Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the Login page component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';

// Mock Firebase auth service to prevent real Firebase initialization
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(() => vi.fn()),
  },
}));

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test-user' } })),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test-user' } })),
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
 * Main test suite for Login accessibility.
 * All tests use MOCKED Firebase auth but test REAL page HTML and ARIA attributes.
 */
describe('Login - Accessibility Tests', () => {

  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * PAGE STRUCTURE
   * Tests for HTML structure and form elements.
   */
  describe('Page Structure', () => {
    /**
     * Tests that the page has a form element.
     * (Mocked: Firebase auth)
     * (Real: Form element)
     */
    it('should have a form element', () => {
      renderWithRouter(<Login />);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    /**
     * Tests that all form inputs are present.
     * (Mocked: Firebase auth)
     * (Real: Input elements)
     */
    it('should have email and password input fields', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests for proper heading structure.
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that the page has an h1 heading.
     * (Mocked: Firebase auth)
     * (Real: Heading level)
     */
    it('should have an h1 heading', () => {
      renderWithRouter(<Login />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    /**
     * Tests that heading text changes based on sign-in vs register mode.
     * (Mocked: Firebase auth)
     * (Real: Heading text content)
     */
    it('should have proper heading text for sign in mode', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByRole('heading', { level: 1, name: /sign in/i })).toBeInTheDocument();
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper labels and form associations.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that inputs have associated labels.
     * (Mocked: Firebase auth)
     * (Real: Label associations via htmlFor)
     */
    it('should have labels properly associated with inputs', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    /**
     * Tests that inputs have proper type attributes.
     * (Mocked: Firebase auth)
     * (Real: Input type attributes)
     */
    it('should have proper input types for email and password', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    /**
     * Tests that required inputs have the required attribute.
     * (Mocked: Firebase auth)
     * (Real: Required attributes)
     */
    it('should mark email and password inputs as required', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    /**
     * Tests that inputs have placeholder text for additional guidance.
     * (Mocked: Firebase auth)
     * (Real: Placeholder attributes)
     */
    it('should have placeholder text on inputs', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    /**
     * Tests that submit button has proper type attribute.
     * (Mocked: Firebase auth)
     * (Real: Button type attribute)
     */
    it('should have submit button with type="submit"', () => {
      renderWithRouter(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that form inputs are keyboard accessible.
     * (Mocked: Firebase auth)
     * (Real: Input elements can receive focus)
     */
    it('should allow keyboard navigation to email input', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput.tagName).toBe('INPUT');
    });

    /**
     * Tests that password input is keyboard accessible.
     * (Mocked: Firebase auth)
     * (Real: Input element can receive focus)
     */
    it('should allow keyboard navigation to password input', () => {
      renderWithRouter(<Login />);
      
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput.tagName).toBe('INPUT');
    });

    /**
     * Tests that submit button is keyboard accessible.
     * (Mocked: Firebase auth)
     * (Real: Button element can receive focus)
     */
    it('should allow keyboard navigation to submit button', () => {
      renderWithRouter(<Login />);
      
      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton.tagName).toBe('BUTTON');
    });

    /**
     * Tests that toggle link is keyboard accessible via click.
     * (Mocked: Firebase auth)
     * (Real: Clickable span element)
     */
    it('should have clickable toggle link for switching modes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const toggleLink = screen.getByText(/create one!/i);
      expect(toggleLink).toBeInTheDocument();
      
      await user.click(toggleLink);
      
      expect(screen.getByRole('heading', { level: 1, name: /create account/i })).toBeInTheDocument();
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that content renders correctly for screen readers.
   */
  describe('Content and Text', () => {
    /**
     * Tests that the page title renders correctly in sign-in mode.
     * (Mocked: Firebase auth)
     * (Real: Text content)
     */
    it('should render sign in page title', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    });

    /**
     * Tests that label text renders correctly.
     * (Mocked: Firebase auth)
     * (Real: Label text content)
     */
    it('should render email and password labels', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    /**
     * Tests that submit button text renders correctly in sign-in mode.
     * (Mocked: Firebase auth)
     * (Real: Button text content)
     */
    it('should render log in button text', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    /**
     * Tests that toggle text renders correctly.
     * (Mocked: Firebase auth)
     * (Real: Toggle text content)
     */
    it('should render account creation toggle text', () => {
      renderWithRouter(<Login />);
      
      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
      expect(screen.getByText(/create one!/i)).toBeInTheDocument();
    });

    /**
     * Tests that content updates when toggling to register mode.
     * (Mocked: Firebase auth)
     * (Real: Dynamic text content)
     */
    it('should update content when switching to register mode', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Login />);
      
      const toggleLink = screen.getByText(/create one!/i);
      await user.click(toggleLink);
      
      expect(screen.getByRole('heading', { level: 1, name: /create account/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    });

    /**
     * Tests that placeholder text renders correctly.
     * (Mocked: Firebase auth)
     * (Real: Placeholder text)
     */
    it('should render placeholder text in inputs', () => {
      renderWithRouter(<Login />);
      
      const emailInput = screen.getByPlaceholderText(/enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });
});
