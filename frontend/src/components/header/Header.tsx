import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginButton from './LoginButton/LoginButton';
import ProfileIcon from './ProfileIcon/ProfileIcon';

/**
 * Header component displays the main navigation bar for the application.
 * Includes the PlatePath logo, main navigation links (Our Story, Generate Your Plan,
 * Your Calendar), and user account actions (Login/Logout button and Profile icon).
 * 
 * @returns {JSX.Element} The Header component
 */
export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="top-bar" role="banner">
      <div className="logo" onClick={() => navigate("/")} aria-hidden="true">PlatePath</div>
      
      <nav className="nav-links" aria-label="Main navigation">
        <button 
          className="nav-button" 
          onClick={() => navigate("/")}
          aria-label="Navigate to Our Story page"
        >
          our story
        </button>
        <button 
          className="nav-button" 
          onClick={() => navigate("/generate-plan")}
          aria-label="Navigate to Generate Your Plan page"
        >
          generate<br />your plan
        </button>
        <button 
          className="nav-button" 
          onClick={() => navigate("/calendar")}
          aria-label="Navigate to Your Calendar page"
        >
          your calendar
        </button>
      </nav>
      
      <div className="header-actions" aria-label="User account actions">
        <LoginButton />
        <ProfileIcon />
      </div>
    </header>
  );
}
