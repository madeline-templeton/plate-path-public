import { useNavigate } from 'react-router-dom';
import './ProfileIcon.css';

/**
 * ProfileIcon component displays a clickable profile icon button
 * that navigates to the user's account page.
 * 
 * @returns {JSX.Element} The ProfileIcon component
 */
export default function ProfileIcon() {
  const navigate = useNavigate();
  
  /**
   * Handles click event to navigate to the account page.
   */
  const handleClick = () => {
    navigate("/account");
  };

  return (
    <button 
      className="profile-icon-button" 
      onClick={handleClick} 
      aria-label="Navigate to Account page"
    >
      <svg
        className="profile-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" fill="#f0faf0" />
        <circle cx="12" cy="9" r="3" fill="#2d5016" />
        <path
          d="M6 18.5C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 18.5"
          stroke="#2d5016"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
