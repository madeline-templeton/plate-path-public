import { useNavigate } from 'react-router-dom';
import './simpleHeader.css';

/**
 * SimpleHeader component displays a simplified navigation bar without user actions.
 * Used on pages like the login page where login/profile buttons aren't needed.
 * Includes the PlatePath logo and main navigation links.
 * 
 * @returns {JSX.Element} The SimpleHeader component
 */
export default function SimpleHeader() {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate("/")}>PlatePath</div>
      
      <nav className="nav-links">
        <button className="nav-button" onClick={() => navigate("/")}>our story</button>
        <button className="nav-button" onClick={() => navigate("/generate-plan")}>generate your plan</button>
        <button className="nav-button" onClick={() => navigate("/calendar")}>your calender</button>
      </nav>

        <div className="header-actions"></div>
    </div>
  );
}