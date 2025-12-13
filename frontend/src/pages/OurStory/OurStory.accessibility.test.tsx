/**
 * OurStory Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the OurStory page component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import OurStory from './OurStory';

/**
 * Mock AuthContext to return no authenticated user.
 * This prevents real authentication logic from running during tests.
 */
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

/**
 * Mock Firebase auth service to prevent real Firebase initialization.
 * No actual authentication or token retrieval happens in tests. 
 */
vi.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

/**
 * Mock axios to prevent real HTTP requests.
 * The OurStory component makes API calls to update consent - we don't need those in accessibility tests.
 */
vi.mock('axios');

/**
 * Helper function to render components with React Router context.
 * OurStory uses React Router's navigate() function, so we need BrowserRouter wrapping.
 * 
 * @param component - The React component to render
 * @returns The render result from React Testing Library
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};



/**
 * Main test suite for OurStory accessibility.
 * All tests use MOCKED backend/auth but test REAL page HTML and ARIA attributes.
 */
describe('OurStory - Accessibility Tests', () => {
  /**
   * Clear localStorage before each test to prevent the PrivacyConsentModal from appearing.
   */
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Tests for HTML structure and landmark regions.
   * Confirms: Proper use of <main>, <section> elements for screen reader navigation.
   */
  describe('Page Structure', () => {
    /**
     * Tests that the page has a main landmark (role="main").
     * This helps screen readers jump to the main content.
     */
    it('should have a main landmark with role="main"', () => {
      renderWithRouter(<OurStory />);
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    /**
     * Tests that both major sections have ARIA labels (aria-labelledby) 
     * so screen readers can announce them properly.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA attributes and connections)
     */
    it('should contain two sections with proper ARIA labels', () => {
      renderWithRouter(<OurStory />);
      
      // Check intro section (labeled by its h1 heading)
      const introSection = screen.getByLabelText(/Welcome to PlatePath!/i);
      expect(introSection).toBeInTheDocument();
      expect(introSection.tagName).toBe('SECTION');
      
      // Check about us section (labeled by its h2 heading)
      const aboutSection = screen.getByLabelText(/About Us/i);
      expect(aboutSection).toBeInTheDocument();
      expect(aboutSection.tagName).toBe('SECTION');
    });
  });

  /**
   * Tests for ARIA label connections and descriptive labels.
   * Confirms: aria-labelledby points to valid IDs, aria-labels are descriptive for screen readers.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that the intro section's aria-labelledby points to the correct heading.
     * Screen readers will say "Welcome to PlatePath! region" when entering the section.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA attributes and heading IDs)
     */
    it('should have correct aria-labelledby connections for intro section', () => {
      renderWithRouter(<OurStory />);
      
      const introSection = document.querySelector('[aria-labelledby="intro-heading"]');
      const introHeading = document.getElementById('intro-heading');
      
      expect(introSection).toBeInTheDocument();
      expect(introHeading).toBeInTheDocument();
      expect(introHeading?.textContent).toBe('Welcome to PlatePath!');
    });

    /**
     * Tests that the about section's aria-labelledby points to the correct heading.
     * Screen readers will say "About Us region" when entering the section.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: ARIA attributes and heading IDs)
     */
    it('should have correct aria-labelledby connections for about section', () => {
      renderWithRouter(<OurStory />);
      
      const aboutSection = document.querySelector('[aria-labelledby="about-heading"]');
      const aboutHeading = document.getElementById('about-heading');
      
      expect(aboutSection).toBeInTheDocument();
      expect(aboutHeading).toBeInTheDocument();
      expect(aboutHeading?.textContent).toBe('About Us');
    });

    /**
     * Tests that navigation links have descriptive aria-labels.
     * Screen readers will read the full description, not just "link".
     * (Mocked: React Router navigation)
     * (Real: ARIA labels and role attributes)
     */
    it('should have descriptive aria-labels for navigation links', () => {
      renderWithRouter(<OurStory />);
      
      // Check "Generate your plan now" link has full context
      const generatePlanLink = screen.getByLabelText(
        /Navigate to Generate Your Plan page to start creating your personalized meal plan/i
      );
      expect(generatePlanLink).toBeInTheDocument();
      expect(generatePlanLink).toHaveAttribute('role', 'link');
      
      // Check "calendar" link has descriptive label
      const calendarLink = screen.getByLabelText(/View your meal plan calendar/i);
      expect(calendarLink).toBeInTheDocument();
      expect(calendarLink).toHaveAttribute('role', 'link');
    });
  });

  /**
   * Tests for image accessibility (alt text).
   * Confirms: All images have descriptive alt text for screen readers.
   */
  describe('Image Alt Text', () => {
    /**
     * Tests that all team member photos have descriptive alt text.
     * Screen readers will read "Photo of [Name]" instead of just "image".
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Image alt attributes)
     */
    it('should have descriptive alt text for all team member photos', () => {
      renderWithRouter(<OurStory />);
      
      // Check Maddie's photo has descriptive alt text
      const maddiePhoto = screen.getByAltText(/Photo of Maddie Templeton/i);
      expect(maddiePhoto).toBeInTheDocument();
      expect(maddiePhoto.tagName).toBe('IMG');
      
      // Check Erik's photo has descriptive alt text
      const erikPhoto = screen.getByAltText(/Photo of Erik Estienne/i);
      expect(erikPhoto).toBeInTheDocument();
      expect(erikPhoto.tagName).toBe('IMG');
      
      // Check Elizabeth's photo has descriptive alt text
      const elizabethPhoto = screen.getByAltText(/Photo of Elizabeth Sessa/i);
      expect(elizabethPhoto).toBeInTheDocument();
      expect(elizabethPhoto.tagName).toBe('IMG');
    });

    /**
     * Tests that team member names use proper heading level (h3).
     * Proper hierarchy: h1 (page title) → h2 (About Us) → h3 (team members).
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Heading elements)
     */
    it('should have proper heading hierarchy for team members', () => {
      renderWithRouter(<OurStory />);
      
      // Check that team member names are h3 elements (proper hierarchy under h2 "About Us")
      const maddieHeading = screen.getByRole('heading', { name: /Maddie Templeton/i, level: 3 });
      const erikHeading = screen.getByRole('heading', { name: /Erik Estienne/i, level: 3 });
      const elizabethHeading = screen.getByRole('heading', { name: /Elizabeth Sessa/i, level: 3 });
      
      expect(maddieHeading).toBeInTheDocument();
      expect(erikHeading).toBeInTheDocument();
      expect(elizabethHeading).toBeInTheDocument();
    });
  });

  /**
   * Tests for keyboard navigation and focus management.
   * Confirms: Interactive elements are keyboard-accessible (tab, enter keys work).
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that the "Generate your plan" link can be focused with the Tab key.
     * Users who cannot use a mouse need this to navigate.
     * (Mocked: React Router navigation)
     * (Real: Keyboard focus and tabIndex attribute)
     */
    it('should allow keyboard navigation to "Generate your plan" link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const generatePlanLink = screen.getByLabelText(
        /Navigate to Generate Your Plan page to start creating your personalized meal plan/i
      );
      
      // Confirm element can receive keyboard focus
      expect(generatePlanLink).toHaveAttribute('tabIndex', '0');
      
      // Simulate pressing Tab key (moves focus)
      await user.tab();
      // Verify focus can be set (activeElement exists)
      expect(document.activeElement).toBeDefined();
    });

    /**
     * Tests that the calendar link can be focused with the Tab key.
     * (Mocked: React Router navigation)
     * (Real: tabIndex attribute)
     */
    it('should allow keyboard navigation to calendar link', async () => {
      const user = userEvent.setup();
      renderWithRouter(<OurStory />);
      
      const calendarLink = screen.getByLabelText(/View your meal plan calendar/i);
      
      // Confirm element is focusable
      expect(calendarLink).toHaveAttribute('tabIndex', '0');
    });

    /**
     * Tests that all navigation elements have role="link".
     * This tells screen readers these are clickable links, not just text.
     * (Mocked: Navigation behavior)
     * (Real: role attributes)
     */
    it('should have proper role attributes for interactive elements', () => {
      renderWithRouter(<OurStory />);
      
      // Find all elements with role="link"
      const links = screen.getAllByRole('link');
      
      // Should include at least: generate-plan link + calendar link
      expect(links.length).toBeGreaterThanOrEqual(2);
    });
  });

  /**
   * Tests for content rendering and text accuracy.
   * Confirms: All expected content appears correctly (not strictly accessibility, but ensures page works).
   */
  describe('Content and Text', () => {
    /**
     * Tests that all main content sections render correctly.
     * This ensures the content exists for screen readers to read.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render all main content sections', () => {
      renderWithRouter(<OurStory />);
      
      // Confirm main heading is present
      expect(screen.getByText('Welcome to PlatePath!')).toBeInTheDocument();
      
      // Confirm subtitle is present
      expect(screen.getByText(/We take the stress out of meal planning/i)).toBeInTheDocument();
      
      // Confirm About Us section renders
      expect(screen.getByText('About Us')).toBeInTheDocument();
      
      // Confirm all team member roles are displayed
      expect(screen.getByText(/Co-founder & Backend Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Co-founder & Full Stack Developer/i)).toBeInTheDocument();
      expect(screen.getByText(/Co-founder & Frontend Developer/i)).toBeInTheDocument();
    });

    /**
     * Tests that biographical text contains important information.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Text content)
     */
    it('should render bio text with correct information', () => {
      renderWithRouter(<OurStory />);
      
      // Confirm all team member names are in the bio
      expect(screen.getByText(/Maddie Templeton, Erik Estienne, and Elizabeth Sessa/i)).toBeInTheDocument();
      
      // Confirm university affiliation is mentioned
      expect(screen.getByText(/Brown University in Providence, Rhode Island/i)).toBeInTheDocument();
      
      // Confirm product features are described
      expect(screen.getByText(/PlatePath factors in users' age, height, weight/i)).toBeInTheDocument();
    });
  });

  /**
   * Tests for proper heading hierarchy (h1 → h2 → h3).
   * Confirms: Headings follow logical order for screen reader navigation and page outline.
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that headings follow proper hierarchy: h1 (page title) → h2 (sections) → h3 (subsections).
     * Screen readers use this to navigate the page.
     * (Mocked: Auth, Firebase, Axios)
     * (Real: Heading elements)
     */
    it('should have proper heading levels (h1 > h2 > h3)', () => {
      renderWithRouter(<OurStory />);
      
      // Confirm exactly one h1 (page title)
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0]).toHaveTextContent('Welcome to PlatePath!');
      
      // Confirm at least one h2 (section heading)
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(1);
      expect(h2Elements[0]).toHaveTextContent('About Us');
      
      // Confirm exactly three h3 elements (team member names)
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements).toHaveLength(3);
    });
  });
});
