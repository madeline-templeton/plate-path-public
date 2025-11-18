import './Header.css';
import LoginButton from './LoginButton/LoginButton';
import ProfileIcon from './ProfileIcon/ProfileIcon';

export default function Header() {
  return (
    <div className="top-bar">
      <div className="logo">PlatePath</div>
      <div className="header-actions">
        <LoginButton />
        <ProfileIcon />
      </div>
    </div>
  );
}
