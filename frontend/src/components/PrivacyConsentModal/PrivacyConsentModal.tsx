import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyConsentModal.css';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

/**
 * PrivacyConsentModal component displays a modal dialog for new users
 * to grant or revoke consent for storing their personal information.
 * Implements focus trapping, ESC key handling, and keyboard navigation.
 * 
 * @param {PrivacyConsentModalProps} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onAccept - Callback when user accepts consent
 * @param {Function} props.onReject - Callback when user rejects consent
 * @returns {JSX.Element | null} The modal component or null if not open
 */
export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onAccept,
  onReject,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReject();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    acceptButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onReject]);

  /**
   * Prevents body scroll when modal is open for better UX.
   * Restores scroll on unmount.
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  /**
   * Handles clicks on Account page links within the modal.
   * Closes the modal (counts as reject) and navigates to account page.
   * 
   * @param {React.MouseEvent} e - The click event
   */
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReject();
    navigate('/account');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onReject}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          className="modal-close" 
          onClick={onReject}
          aria-label="Decline data storage and close privacy consent dialog"
        >
          ×
        </button>

        <h1 id="modal-title" className="modal-title">Welcome to PlatePath!</h1>
        
        <p className="modal-subtitle">Thank you for creating an account!</p>

        <div className="modal-divider" aria-hidden="true"></div>

        <div id="modal-description" className="modal-section">
          <p className="modal-text">
            We automatically save your active meal plan as well as meal upvotes and downvotes. 
            This makes PlatePath work seamlessly for you. You can disable this anytime in your{' '}
            <a 
              href="/account" 
              onClick={handleProfileClick} 
              className="modal-link"
              aria-label="Navigate to your Account page to manage data storage preferences"
            >
              Account
            </a>.
          </p>
        </div>

        <div className="modal-divider" aria-hidden="true"></div>

        <section className="modal-section" aria-labelledby="personal-info-heading">
          <h2 id="personal-info-heading" className="modal-section-title">Personal Information</h2>
          <p className="modal-text">
            Would you like us to remember your personal profile (age, sex, height, current weight, etc.) for faster 
            meal plan creation?
          </p>
          <p className="modal-privacy">
            All data is stored securely in your account. We do NOT share or sell your information. 
            Manage preferences anytime in your{' '}
            <a 
              href="/account" 
              onClick={handleProfileClick} 
              className="modal-link"
              aria-label="Navigate to your Account page to manage privacy settings"
            >
              Account
            </a>.
          </p>
          <p className="modal-question">May we save your personal information?</p>
        </section>

        <div className="modal-actions" role="group" aria-label="Privacy consent decision">
          <button 
            className="modal-button modal-button-reject" 
            onClick={onReject}
            aria-label="Reject saving personal information. You can change this later in your Account settings."
          >
            Reject
          </button>
          <button 
            className="modal-button modal-button-accept" 
            onClick={onAccept}
            ref={acceptButtonRef}
            aria-label="Accept saving personal information. You can change this later in your Account settings."
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
