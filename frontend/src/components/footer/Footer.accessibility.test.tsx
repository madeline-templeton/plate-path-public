/**
 * Footer Accessibility Test Suite
 * 
 * Tests ARIA labels, HTML structure, and accessibility compliance
 * for the Footer component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

/**
 * TESTING SUITE
 * Main test suite for Footer accessibility.
 * All tests focus on REAL footer HTML and ARIA attributes.
 */
describe('Footer - Accessibility Tests', () => {

  /**
   * PAGE STRUCTURE
   * Tests for proper footer structure and landmark roles.
   */
  describe('Page Structure', () => {
    /**
     * Tests that footer has role="contentinfo".
     */
    it('should have role="contentinfo" for the footer', () => {
      render(<Footer />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });
  });

  /**
   * HEADING HIERARCHY
   * Tests for proper heading structure.
   */
  describe('Heading Hierarchy', () => {
    /**
     * Tests that footer does not use heading elements.
     */
    it('should not contain heading elements', () => {
      render(<Footer />);
      
      const headings = screen.queryAllByRole('heading');
      expect(headings.length).toBe(0);
    });
  });

  /**
   * ARIA LABELS AND ATTRIBUTES
   * Tests for proper ARIA labels on content.
   */
  describe('ARIA Labels and Attributes', () => {
    /**
     * Tests that disclaimer paragraph has descriptive aria-label.
     */
    it('should have descriptive aria-label on disclaimer paragraph', () => {
      render(<Footer />);
      
      const disclaimer = document.querySelector('[aria-label="Disclaimer about meal planning and nutritional information"]');
      expect(disclaimer).toBeInTheDocument();
    });

    /**
     * Tests that copyright paragraph has descriptive aria-label.
     */
    it('should have descriptive aria-label on copyright paragraph', () => {
      render(<Footer />);
      
      const copyright = document.querySelector('[aria-label="Copyright and creator credits"]');
      expect(copyright).toBeInTheDocument();
    });
  });

  /**
   * KEYBOARD NAVIGATION
   * Tests for keyboard accessibility.
   */
  describe('Keyboard Navigation', () => {
    /**
     * Tests that footer contains no interactive elements.
     */
    it('should contain no interactive elements', () => {
      render(<Footer />);
      
      const buttons = screen.queryAllByRole('button');
      const links = screen.queryAllByRole('link');
      
      expect(buttons.length).toBe(0);
      expect(links.length).toBe(0);
    });
  });

  /**
   * CONTENT AND TEXT
   * Tests that content renders correctly for screen readers.
   */
  describe('Content and Text', () => {
    /**
     * Tests that disclaimer text renders correctly.
     */
    it('should render disclaimer text', () => {
      render(<Footer />);
      
      expect(screen.getByText(/disclaimer:/i)).toBeInTheDocument();
      expect(screen.getByText(/platepath provides meal planning suggestions/i)).toBeInTheDocument();
    });

    /**
     * Tests that copyright and creator information renders.
     */
    it('should render copyright and creator information', () => {
      render(<Footer />);
      
      expect(screen.getByText(/© 2025 platepath/i)).toBeInTheDocument();
      expect(screen.getByText(/elizabeth sessa, maddie templeton, and erik estienne/i)).toBeInTheDocument();
    });
  });
});
