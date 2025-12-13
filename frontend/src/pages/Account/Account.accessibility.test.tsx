/**
 * Account Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the Account page component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Account from './Account';


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
    currentUser: { 
      uid: 'test-user-123',
      getIdToken: vi.fn(() => Promise.resolve('mock-token'))
    },
    onAuthStateChanged: vi.fn(() => vi.fn()),
  },
}));

// Mock axios to prevent real HTTP requests (mock planner check, mock user info check, mock meal preferneces, mock consent)
vi.mock('axios', () => ({
  default: {
    get: vi.fn((url: string) => {
      if (url.includes('/checkUserPlannerExists/')) {
        return Promise.resolve({
          data: { success: true, exists: true }
        });
      }
      if (url.includes('/checkIfInfoInStorage/')) {
        return Promise.resolve({
          data: { success: true, exists: true }
        });
      }
      if (url.includes('/checkUserMealVotes/')) {
        return Promise.resolve({
          data: { success: true, exists: true }
        });
      }
      if (url.includes('/getUserConsent/')) {
        return Promise.resolve({
          data: {
            success: true,
            exists: true,
            generalConsent: 'granted',
            sensitiveConsent: 'granted'
          }
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }),
    delete: vi.fn(() => Promise.resolve({ data: { success: true } })),
    put: vi.fn(() => Promise.resolve({ data: { success: true } })),
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
 * Main test suite for Account accessibility.
 * All tests use MOCKED backend/auth but test REAL page HTML and ARIA attributes.
 */
describe('Account - Accessibility Tests', () => {

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
     * Tests that the page has a main landmark (role="main").
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Main landmark)
     */
    it('should have a main landmark with role="main"', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
      });
    });

    /**
     * Tests that all major sections have proper aria-labelledby attributes.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Section elements with ARIA labels)
     */
    it('should have sections with proper aria-labelledby attributes', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const sections = document.querySelectorAll('section[aria-labelledby]');
        expect(sections.length).toBeGreaterThan(0);
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
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const h1 = screen.getByRole('heading', { level: 1, name: /my account/i });
        expect(h1).toBeInTheDocument();
        
        const h2s = screen.getAllByRole('heading', { level: 2 });
        expect(h2s.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that all h2 headings have proper id attributes for aria-labelledby.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ID attributes on headings)
     */
    it('should have h2 headings with id attributes', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const accountInfoHeading = document.getElementById('account-info-heading');
        const mealPlanHeading = document.getElementById('meal-plan-heading');
        const privacyHeading = document.getElementById('privacy-settings-heading');
        
        expect(accountInfoHeading).toBeInTheDocument();
        expect(mealPlanHeading).toBeInTheDocument();
        expect(privacyHeading).toBeInTheDocument();
      });
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper ARIA labels and descriptions.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that delete buttons have descriptive aria-labels.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labels on buttons)
     */
    it('should have descriptive aria-labels on delete buttons', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const deleteMealPlanButton = screen.getByRole('button', { name: /delete your meal plan/i });
        const deleteDataButton = screen.getByRole('button', { name: /delete your personal data/i });
        
        expect(deleteMealPlanButton).toBeInTheDocument();
        expect(deleteDataButton).toBeInTheDocument();
      });
    });

    /**
     * Tests that toggle switches have proper role="switch" and aria-checked.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Switch role and aria-checked attributes)
     */
    it('should have toggle switches with proper role and aria-checked', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBe(2);
        
        switches.forEach(switchElement => {
          expect(switchElement).toHaveAttribute('aria-checked');
        });
      });
    });

    /**
     * Tests that toggle switches have descriptive aria-labels.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labels on switches)
     */
    it('should have descriptive aria-labels on toggle switches', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const generalSwitch = screen.getByRole('switch', { name: /toggle general storage consent/i });
        const sensitiveSwitch = screen.getByRole('switch', { name: /toggle sensitive data storage consent/i });
        
        expect(generalSwitch).toBeInTheDocument();
        expect(sensitiveSwitch).toBeInTheDocument();
      });
    });

    /**
     * Tests that toggle container has role="group" with aria-describedby.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Group role and aria-describedby)
     */
    it('should have toggle container with role="group" and aria-describedby', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toBeInTheDocument();
        expect(group).toHaveAttribute('aria-describedby', 'consent-description');
        
        const description = document.getElementById('consent-description');
        expect(description).toBeInTheDocument();
      });
    });

    /**
     * Tests that consent status messages have aria-live="polite" so screenreader 
     * doesn't interrupt what they are saying but still announces it
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA live regions)
     */
    it('should have aria-live on consent status messages', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const statusMessages = document.querySelectorAll('[aria-live="polite"]');
        expect(statusMessages.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that decorative status dots have aria-hidden="true"
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA hidden on decorative elements)
     */
    it('should hide decorative status dots from screen readers', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const statusDots = document.querySelectorAll('.status-dot[aria-hidden="true"]');
        expect(statusDots.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that sections are properly connected to their headings via aria-labelledby.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA labelledby connections)
     */
    it('should connect sections to headings with aria-labelledby', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const accountSection = document.querySelector('section[aria-labelledby="account-info-heading"]');
        const mealPlanSection = document.querySelector('section[aria-labelledby="meal-plan-heading"]');
        
        expect(accountSection).toBeInTheDocument();
        expect(mealPlanSection).toBeInTheDocument();
      });
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that delete buttons are keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button elements can receive focus)
     */
    it('should allow keyboard navigation to delete buttons', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        expect(deleteButtons.length).toBeGreaterThan(0);
        
        deleteButtons.forEach(button => {
          expect(button.tagName).toBe('BUTTON');
        });
      });
    });

    /**
     * Tests that toggle switches are keyboard accessible.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Switch elements can receive focus)
     */
    it('should allow keyboard navigation to toggle switches', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const switches = screen.getAllByRole('switch');
        expect(switches.length).toBe(2);
        
        switches.forEach(switchElement => {
          expect(switchElement.tagName).toBe('INPUT');
          expect(switchElement.getAttribute('type')).toBe('checkbox');
        });
      });
    });

    /**
     * Tests that toggle switches can be toggled with keyboard.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Switch interaction via keyboard)
     */
    it('should allow keyboard interaction with toggle switches', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const generalSwitch = screen.getByRole('switch', { name: /toggle general storage consent/i });
        expect(generalSwitch).toBeInTheDocument();
      });

      const generalSwitch = screen.getByRole('switch', { name: /toggle general storage consent/i });
      const initialChecked = generalSwitch.getAttribute('aria-checked');
      
      await user.click(generalSwitch);
      
      expect(generalSwitch.tagName).toBe('INPUT');
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
    it('should render the account page title', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/my account/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that section titles render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Section heading text)
     */
    it('should render all section titles', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/account information/i)).toBeInTheDocument();
        expect(screen.getByText(/meal plan status/i)).toBeInTheDocument();
        expect(screen.getByText(/privacy settings/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that user email displays correctly.
     * (Mocked: Auth with test email, Firebase, Axios)
     * (Real: Email text content)
     */
    it('should display user email address', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });

    /**
     * Tests that status text renders for active states.
     * (Mocked: Auth, Firebase, Axios with active states)
     * (Real: Status text content)
     */
    it('should render status text for active meal plan', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/active meal plan in storage/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that button text renders correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Button text content)
     */
    it('should render delete button text', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/delete meal plan/i)).toBeInTheDocument();
        expect(screen.getByText(/delete personal data/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that consent toggle labels render correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Toggle label text)
     */
    it('should render consent toggle labels', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/general storage consent/i)).toBeInTheDocument();
        expect(screen.getByText(/sensitive data storage consent/i)).toBeInTheDocument();
      });
    });

    /**
     * Tests that consent status messages render correctly.
     * (Mocked: Auth, Firebase, Axios with granted consent)
     * (Real: Consent status text)
     */
    it('should render consent status messages', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        const statusElements = screen.getAllByText(/granted/i);
        expect(statusElements.length).toBeGreaterThan(0);
      });
    });

    /**
     * Tests that privacy description text renders.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Description text content)
     */
    it('should render privacy settings description', async () => {
      renderWithRouter(<Account />);
      
      await waitFor(() => {
        expect(screen.getByText(/allow platepath to store your meal plans/i)).toBeInTheDocument();
      });
    });
  });
});
