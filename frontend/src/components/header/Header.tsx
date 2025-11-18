import './Header.css';
import LoginButton from './LoginButton/LoginButton';
import ProfileIcon from './ProfileIcon/ProfileIcon';

export default function Header() {
  return (
    <div className="top-bar">
      <div className="logo">PlatePath</div>
      
      <nav className="nav-links">
        <button className="nav-button">our story</button>
        <button className="nav-button">generate your plan</button>
        <button className="nav-button">your calender</button>
      </nav>
      
      <div className="header-actions">
        <LoginButton />
        <ProfileIcon />
      </div>
    </div>
  );
}
