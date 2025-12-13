/**
 * Header Functional Test Suite
 *
 * Tests UI rendering, navigation button interactions, and logo click
 * for the Header component with mocked navigation.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate to test navigation calls
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/**
 * Helper function to render Header with router context.
 */
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * TESTING SUITE
 * Main test suite for Header functional UI behavior.
 * All tests use MOCKED navigation and test REAL component logic and UI state.
 */
describe('Header - Functional UI Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Tests that the header renders logo, nav buttons, and user actions.
   * (Mocked: useNavigate)
   * (Real: Text content rendering)
   */
  it('should render logo, nav buttons, and user actions', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText(/PlatePath/i)).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /our story/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate your plan/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /your calendar/i })).toBeInTheDocument();
  });

  /**
   * Tests that clicking nav buttons and logo call navigate with correct routes.
   * (Mocked: useNavigate)
   * (Real: User click interaction)
   */
  it('should navigate to correct pages when nav buttons or logo are clicked', async () => {
    renderWithRouter(<Header />);
    await userEvent.click(screen.getByText(/PlatePath/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    await userEvent.click(screen.getByRole('button', { name: /our story/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    await userEvent.click(screen.getByRole('button', { name: /generate your plan/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/generate-plan');
    await userEvent.click(screen.getByRole('button', { name: /your calendar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });
});
