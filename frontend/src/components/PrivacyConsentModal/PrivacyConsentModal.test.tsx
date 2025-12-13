/**
 * PrivacyConsentModal Functional Test Suite
 *
 * Tests UI rendering, button interactions, and dialog logic
 * for the PrivacyConsentModal component with mocked props.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { PrivacyConsentModal } from './PrivacyConsentModal';

/**
 * TESTING SUITE
 * Main test suite for PrivacyConsentModal functional UI behavior.
 * All tests use MOCKED props and test REAL component logic and UI state.
 */
describe('PrivacyConsentModal - Functional UI Tests', () => {
  /**
   * Tests that the modal renders with correct title, subtitle, and buttons when open.
   * (Mocked: Props)
   * (Real: Text content rendering)
   */
  it('should render modal with title, subtitle, and action buttons when open', () => {
    render(
      <BrowserRouter>
        <PrivacyConsentModal isOpen={true} onAccept={() => {}} onReject={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to PlatePath!/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for creating an account!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  /**
   * Tests that clicking Accept and Reject buttons call the respective handlers.
   * (Mocked: onAccept, onReject)
   * (Real: User click interaction)
   */
  it('should call onAccept and onReject when buttons are clicked', async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    render(
      <BrowserRouter>
        <PrivacyConsentModal isOpen={true} onAccept={onAccept} onReject={onReject} />
      </BrowserRouter>
    );
    await userEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(onReject).toHaveBeenCalled();
  });

  /**
   * Tests that the modal is not rendered when isOpen is false.
   * (Mocked: Props)
   * (Real: Conditional rendering)
   */
  it('should not render modal when isOpen is false', () => {
    render(
      <BrowserRouter>
        <PrivacyConsentModal isOpen={false} onAccept={() => {}} onReject={() => {}} />
      </BrowserRouter>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
