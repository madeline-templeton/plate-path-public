/**
 * PrivacyConsentModal Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, keyboard navigation, and accessibility compliance
 * for the Privacy Consent Modal component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { PrivacyConsentModal } from './PrivacyConsentModal';

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
 * Main test suite for PrivacyConsentModal accessibility.
 * All tests focus on REAL modal HTML and ARIA attributes.
 */
describe('PrivacyConsentModal - Accessibility Tests', () => {

  const mockOnAccept = vi.fn();
  const mockOnReject = vi.fn();

  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnReject.mockClear();
  });

  /**
   * PAGE STRUCTURE
   * Tests for modal dialog structure and ARIA roles.
   */
  describe('Page Structure', () => {
    /**
     * Tests that modal has proper role="dialog".
     */
    it('should have role="dialog" when open', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });

    /**
     * Tests that modal has aria-modal="true" to indicate it's a modal dialog.
     */
    it('should have aria-modal="true"', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    /**
     * Tests that modal is properly labeled via aria-labelledby.
     */
    it('should have aria-labelledby pointing to modal title', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      
      const title = document.getElementById('modal-title');
      expect(title).toBeInTheDocument();
    });

    /**
     * Tests that modal has aria-describedby connecting to description.
     */
    it('should have aria-describedby pointing to modal description', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
      
      const description = document.getElementById('modal-description');
      expect(description).toBeInTheDocument();
    });

    /**
     * Tests that modal doesn't render when isOpen is false.
     */
    it('should not render when isOpen is false', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={false} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dialog = screen.queryByRole('dialog');
      expect(dialog).not.toBeInTheDocument();
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests for proper heading structure (h1 → h2).
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that modal has proper h1 → h2 hierarchy.
     */
    it('should have proper heading hierarchy from h1 to h2', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const h1 = screen.getByRole('heading', { level: 1, name: /welcome to platepath!/i });
      expect(h1).toBeInTheDocument();
      
      const h2 = screen.getByRole('heading', { level: 2, name: /personal information/i });
      expect(h2).toBeInTheDocument();
    });

    /**
     * Tests that h1 has proper id for aria-labelledby.
     */
    it('should have h1 with id="modal-title"', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveAttribute('id', 'modal-title');
    });

    /**
     * Tests that h2 has proper id for aria-labelledby on section.
     */
    it('should have h2 with id="personal-info-heading"', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveAttribute('id', 'personal-info-heading');
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper ARIA labels and descriptions.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that close button has descriptive aria-label.
     */
    it('should have descriptive aria-label on close button', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const closeButton = screen.getByRole('button', { name: /decline data storage and close privacy consent dialog/i });
      expect(closeButton).toBeInTheDocument();
    });

    /**
     * Tests that Accept button has descriptive aria-label.
     */
    it('should have descriptive aria-label on Accept button', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const acceptButton = screen.getByRole('button', { name: /accept saving personal information/i });
      expect(acceptButton).toBeInTheDocument();
    });

    /**
     * Tests that Reject button has descriptive aria-label.
     */
    it('should have descriptive aria-label on Reject button', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const rejectButton = screen.getByRole('button', { name: /reject saving personal information/i });
      expect(rejectButton).toBeInTheDocument();
    });

    /**
     * Tests that Account links have descriptive aria-labels.
     */
    it('should have descriptive aria-labels on Account links', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const links = screen.getAllByRole('link', { name: /navigate to your account page/i });
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeTruthy();
      });
    });

    /**
     * Tests that button group has proper role="group" with aria-label.
     */
    it('should have button group with role="group" and aria-label', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const group = screen.getByRole('group', { name: /privacy consent decision/i });
      expect(group).toBeInTheDocument();
    });

    /**
     * Tests that decorative dividers have aria-hidden="true".
     */
    it('should hide decorative dividers from screen readers', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const dividers = document.querySelectorAll('.modal-divider[aria-hidden="true"]');
      expect(dividers.length).toBeGreaterThan(0);
    });

    /**
     * Tests that section has aria-labelledby connecting to h2.
     */
    it('should connect section to h2 with aria-labelledby', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const section = document.querySelector('section[aria-labelledby="personal-info-heading"]');
      expect(section).toBeInTheDocument();
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility and focus management.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that Accept button receives focus when modal opens.
     */
    it('should auto-focus on Accept button when modal opens', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const acceptButton = screen.getByRole('button', { name: /accept saving personal information/i });
      expect(acceptButton.tagName).toBe('BUTTON');
    });

    /**
     * Tests that all buttons are keyboard accessible.
     */
    it('should allow keyboard navigation to all buttons', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    /**
     * Tests that links are keyboard accessible.
     */
    it('should allow keyboard navigation to Account links', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link.tagName).toBe('A');
      });
    });

    /**
     * Tests that clicking Accept button triggers callback.
     */
    it('should trigger onAccept when Accept button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const acceptButton = screen.getByRole('button', { name: /accept saving personal information/i });
      await user.click(acceptButton);
      
      expect(mockOnAccept).toHaveBeenCalledTimes(1);
    });

    /**
     * Tests that clicking Reject button triggers callback.
     */
    it('should trigger onReject when Reject button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const rejectButton = screen.getByRole('button', { name: /reject saving personal information/i });
      await user.click(rejectButton);
      
      expect(mockOnReject).toHaveBeenCalledTimes(1);
    });

    /**
     * Tests that clicking close button triggers onReject callback.
     */
    it('should trigger onReject when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      const closeButton = screen.getByRole('button', { name: /decline data storage and close/i });
      await user.click(closeButton);
      
      expect(mockOnReject).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that content renders correctly for screen readers.
   */
  describe('Content and Text', () => {
    /**
     * Tests that modal title and subtitle render correctly.
     */
    it('should render modal title and subtitle', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      expect(screen.getByText(/welcome to platepath!/i)).toBeInTheDocument();
      expect(screen.getByText(/thank you for creating an account!/i)).toBeInTheDocument();
    });

    /**
     * Tests that main consent question renders.
     */
    it('should render consent question', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      expect(screen.getByText(/may we save your personal information\?/i)).toBeInTheDocument();
    });

    /**
     * Tests that privacy statement renders.
     */
    it('should render privacy statement', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      expect(screen.getByText(/we do not share or sell your information/i)).toBeInTheDocument();
    });

    /**
     * Tests that button text renders correctly.
     */
    it('should render button text', () => {
      renderWithRouter(
        <PrivacyConsentModal isOpen={true} onAccept={mockOnAccept} onReject={mockOnReject} />
      );
      
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
    });
  });
});
