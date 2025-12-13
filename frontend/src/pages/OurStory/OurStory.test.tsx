/**
 * OurStory Functional Test Suite
 * 
 * Tests component behavior, user interactions, modal logic, navigation, and API integration
 * for the OurStory page component with mocked dependencies.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import OurStory from './OurStory';
import axios from 'axios';
import '@testing-library/jest-dom';


 // Mock axios to prevent real HTTP requests so that API calls to /updateUserConsent are intercepted and don't hit the backend.
vi.mock('axios');


 // Mock Firebase auth service to prevent real authentication that provides a mock token for authorization headers in API calls.
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('mock-token')
    }
  }
}));


 // Mock AuthContext to return a test user to prevent real authentication logic from running during tests.
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
 * Main test suite for OurStory functional behavior.
 * All tests use MOCKED backend/auth but test REAL component logic, user interactions, and UI state.
 */
describe('OurStory - Functional Tests', () => {

   // Reset all mocks and clear localStorage before each test to prevent tests from affecting each other
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (axios.put as any).mockResolvedValue({ data: { success: true } });
  });

  /**
   * CONTENT RENDERING
   * Tests for content rendering and text accuracy.
   */
  describe('Content Rendering', () => {
    /**
     * Tests that the welcome section displays the correct title and subtitle.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content rendering)
     */
    it('should render welcome title and subtitle', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByText('Welcome to PlatePath!')).toBeInTheDocument();
      expect(screen.getByText(/We take the stress out of meal planning/i)).toBeInTheDocument();
    });

    /**
     * Tests that all three team member names are displayed on the page.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render all three team members', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByText('Maddie Templeton')).toBeInTheDocument();
      expect(screen.getByText('Erik Estienne')).toBeInTheDocument();
      expect(screen.getByText('Elizabeth Sessa')).toBeInTheDocument();
    });

    /**
     * Tests that team member roles are displayed correctly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render team member roles', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByText('Co-founder & Backend Developer')).toBeInTheDocument();
      expect(screen.getByText('Co-founder & Full Stack Developer')).toBeInTheDocument();
      expect(screen.getByText('Co-founder & Frontend Developer')).toBeInTheDocument();
    });

    /**
     * Tests that team member photos are rendered with proper alt text for accessibility.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Image elements and alt attributes)
     */
    it('should render team member photos with alt text', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByAltText('Photo of Maddie Templeton')).toBeInTheDocument();
      expect(screen.getByAltText('Photo of Erik Estienne')).toBeInTheDocument();
      expect(screen.getByAltText('Photo of Elizabeth Sessa')).toBeInTheDocument();
    });

    /**
     * Tests that bio section contains text describing the team background.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render bio text describing the team', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByText(/The creators of PlatePath/i)).toBeInTheDocument();
      expect(screen.getByText(/sophomore student-athletes at Brown University/i)).toBeInTheDocument();
    });

    /**
     * Tests that bio section contains text describing PlatePath features and functionality.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render bio text describing PlatePath features', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.getByText(/PlatePath factors in users' age, height, weight/i)).toBeInTheDocument();
      expect(screen.getByText(/one week, two week, and four week plans/i)).toBeInTheDocument();
    });
  });

  /**
   * NAVIGATION FUNCTIONALITY
   * Tests for clickable links and keyboard navigation work correctly.
   */
  describe('Navigation Functionality', () => {
    /**
     * Tests that clicking "Generate your plan now" link navigates to /generate-plan.
     * (Mocked: React Router navigation)
     * (Real: User click interaction)
     */
    it('should navigate to generate plan page when clicking "Generate your plan now" link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const generateLink = screen.getByText('Generate your plan now');
      await user.click(generateLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/generate-plan');
    });

    /**
     * Tests that pressing Enter on "Generate your plan now" link navigates to /generate-plan.
     * (Mocked: React Router navigation)
     * (Real: Keyboard event handling)
     */
    it('should navigate to generate plan page when pressing Enter on "Generate your plan now" link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const generateLink = screen.getByText('Generate your plan now');
      generateLink.focus();
      await user.keyboard('{Enter}');
      
      expect(mockNavigate).toHaveBeenCalledWith('/generate-plan');
    });

    /**
     * Tests that clicking "calendar" link navigates to /calendar.
     * (Mocked: React Router navigation)
     * (Real: User click interaction)
     */
    it('should navigate to calendar page when clicking "calendar" link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const calendarLink = screen.getByText('calendar');
      await user.click(calendarLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });

    /**
     * Tests that pressing Enter on "calendar" link navigates to /calendar.
     * (Mocked: React Router navigation)
     * (Real: Keyboard event handling)
     */
    it('should navigate to calendar page when pressing Enter on "calendar" link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const calendarLink = screen.getByText('calendar');
      calendarLink.focus();
      await user.keyboard('{Enter}');
      
      expect(mockNavigate).toHaveBeenCalledWith('/calendar');
    });
  });

  /**
   * PRIVACY CONSENT MODAL --> DISPLAY LOGIC
   * Tests for privacy consent modal display logic (that is appears/doesn't appear under correct conditions).
   */
  describe('Privacy Consent Modal - Display Logic', () => {
    /**
     * Tests that modal does not appear by default without localStorage flags.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Modal display logic, localStorage checks)
     */
    it('should not show modal by default', () => {
      renderWithRouter(<OurStory />);
      
      expect(screen.queryByText(/Thank you for creating an account!/i)).not.toBeInTheDocument();
    });

    /**
     * Tests that modal does not appear if user has already seen it.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: localStorage flag checking)
     */
    it('should not show modal if user has already seen consent', () => {
      localStorage.setItem('showPrivacyConsent', 'true');
      localStorage.setItem('privacyConsentSeen', 'true');
      
      renderWithRouter(<OurStory />);
      
      expect(screen.queryByText(/Thank you for creating an account!/i)).not.toBeInTheDocument();
    });

    /**
     * Test: Modal appears for new signups who have not seen the consent dialog.
     * (Real:) useEffect hook triggers modal based on localStorage
     */
    it('should show modal for new signups who have not seen consent', async () => {
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
    });

    /**
     * Test: showPrivacyConsent flag is cleared from localStorage after modal is displayed.
     * (Real:) localStorage flag management
     */
    it('should clear showPrivacyConsent flag when modal is shown', async () => {
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      expect(localStorage.getItem('showPrivacyConsent')).toBeNull();
    });
  });

  /**
   * PRIVACY CONSENT MODAL --> ACCEPT FUNCTIONALITY
   * Test suite for accepting privacy consent that verifies modal closes, localStorage updates, and API is called correctly.
   * (Real:) User click interaction, modal state change, localStorage update
   * (Mocked:) API call to /updateUserConsent intercepted
   */
  describe('Privacy Consent Modal - Accept Functionality', () => {
    /**
     * Test: Clicking Accept button closes modal and saves privacyConsentSeen flag.
     */
    it('should close modal and save consent when user accepts', async () => {
      const user = userEvent.setup();
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const acceptButton = screen.getByRole('button', { name: /accept/i });
      await user.click(acceptButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/Thank you for creating an account!/i)).not.toBeInTheDocument();
      });
      
      expect(localStorage.getItem('privacyConsentSeen')).toBe('true');
    });

    /**
     * Test: Accept button triggers API call with granted consent status.
     * (Mocked:) Verifies axios.put is called with correct parameters (no real backend request)
     */
    it('should call API with granted consent when user accepts', async () => {
      const user = userEvent.setup();
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const acceptButton = screen.getByRole('button', { name: /accept/i });
      await user.click(acceptButton);
      
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:8080/updateUserConsent',
          {
            sensitiveConsent: 'granted',
            generalConsent: 'granted',
            providedUserId: 'test-user-123'
          },
          expect.objectContaining({
            headers: { 'Authorization': 'Bearer mock-token' }
          })
        );
      });
    });
  });

  /**
   * PRIVACY CONSENT MODAL -->REJECT FUNCTIONALITY
   * Test suite for rejecting privacy consent that verifies modal closes, localStorage updates, and API is called with revoked status.
   * (Real:) User click interaction, modal closes, localStorage updated
   * (Mocked:) API call intercepted
   */
  describe('Privacy Consent Modal - Reject Functionality', () => {
    /**
     * Test: Clicking Reject button closes modal and saves privacyConsentSeen flag.
     */
    it('should close modal and save consent when user rejects', async () => {
      const user = userEvent.setup();
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const rejectButton = screen.getByRole('button', { name: /reject/i });
      await user.click(rejectButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/Thank you for creating an account!/i)).not.toBeInTheDocument();
      });
      
      expect(localStorage.getItem('privacyConsentSeen')).toBe('true');
    });

    /**
     * Test: Reject button triggers API call with revoked sensitive consent.
     * (Mocked:) Verifies API called with sensitiveConsent: 'revoked', generalConsent: 'granted'
     */
    it('should call API with revoked consent when user rejects', async () => {
      const user = userEvent.setup();
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const rejectButton = screen.getByRole('button', { name: /reject/i });
      await user.click(rejectButton);
      
      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith(
          'http://localhost:8080/updateUserConsent',
          {
            sensitiveConsent: 'revoked',
            generalConsent: 'granted',
            providedUserId: 'test-user-123'
          },
          expect.objectContaining({
            headers: { 'Authorization': 'Bearer mock-token' }
          })
        );
      });
    });
  });

  /**
   * PRIVACY CONSENT MODAL --> ERROR HANDLING
   * Test suite for consent API error handling that verifies appropriate error messages are displayed when API fails.
   * (Mocked:) API returns failure response or throws error
   * (Real:) Error handling logic displays alert
   */
  describe('Privacy Consent Modal - Error Handling', () => {
    /**
     * Test: Alert is displayed when API returns success: false response.
     */
    it('should show alert when consent update fails', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      (axios.put as any).mockResolvedValueOnce({ data: { success: false } });
      
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const acceptButton = screen.getByRole('button', { name: /accept/i });
      await user.click(acceptButton);
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error while updating consent. Please try again.');
      });
      
      alertSpy.mockRestore();
    });

    /**
     * Test: Alert is displayed when API throws network error.
     * (Mocked:) API throws network error
     * (Real:) Catch block handles error and displays alert
     */
    it('should show alert when consent API throws error', async () => {
      const user = userEvent.setup();
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (axios.put as any).mockRejectedValueOnce(new Error('Network error'));
      
      localStorage.setItem('showPrivacyConsent', 'true');
      
      renderWithRouter(<OurStory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
      });
      
      const acceptButton = screen.getByRole('button', { name: /accept/i });
      await user.click(acceptButton);
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error while updating consent. Please try again.');
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
      
      alertSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  /**
   * PRIVACY CONSENT MODAL -->IMAGE LOADING
   * Test suite for image asset loading.
   * Verifies that team member photos have correct src attributes.
   * (Real:) Verifies img src attributes point to correct asset paths
   */
  describe('Image Loading', () => {
    /**
     * Test: Team member photo img elements have correct src paths.
     */
    it('should have correct image sources for team photos', () => {
      renderWithRouter(<OurStory />);
      
      const maddieImg = screen.getByAltText('Photo of Maddie Templeton') as HTMLImageElement;
      const erikImg = screen.getByAltText('Photo of Erik Estienne') as HTMLImageElement;
      const elizabethImg = screen.getByAltText('Photo of Elizabeth Sessa') as HTMLImageElement;
      
      expect(maddieImg.src).toContain('/images/team/maddie-templeton.webp');
      expect(erikImg.src).toContain('/images/team/erik-estienne.webp');
      expect(elizabethImg.src).toContain('/images/team/elizabeth-sessa.webp');
    });
  });
});
