import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivacyConsentModal.css';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onAccept,
  onReject,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key closes modal (counts as reject)
      if (e.key === 'Escape') {
        onReject();
        return;
      }

      // Tab key focus trap
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
    
    // Focus on Accept button when modal opens
    acceptButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onReject]);

  // Prevent body scroll when modal is open
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

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReject(); // Close modal
    navigate('/account'); // Navigate to profile page
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onReject}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          className="modal-close" 
          onClick={onReject}
          aria-label="Close modal"
        >
          ×
        </button>

        <h1 id="modal-title" className="modal-title">Welcome to PlatePath!</h1>
        
        <p className="modal-subtitle">Thank you for creating an account!</p>

        <div className="modal-divider"></div>

        <div className="modal-section">
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

        <div className="modal-divider"></div>

        <div className="modal-section">
          <h2 className="modal-section-title">Personal Information</h2>
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
        </div>

        <div className="modal-actions">
          <button 
            className="modal-button modal-button-reject" 
            onClick={onReject}
          >
            Reject
          </button>
          <button 
            className="modal-button modal-button-accept" 
            onClick={onAccept}
            ref={acceptButtonRef}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
