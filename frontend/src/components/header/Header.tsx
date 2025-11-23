import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginButton from './LoginButton/LoginButton';
import ProfileIcon from './ProfileIcon/ProfileIcon';

 

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate("/")}>PlatePath</div>
      
      <nav className="nav-links">
        <button className="nav-button" onClick={() => navigate("/")}>our story</button>
        <button className="nav-button" onClick={() => navigate("/generate-plan")}>
          generate<br />your plan
        </button>
        <button className="nav-button" onClick={() => navigate("/calendar")}>your calender</button>
      </nav>
      
      <div className="header-actions">
        <LoginButton />
        <ProfileIcon />
      </div>
    </div>
  );
}
