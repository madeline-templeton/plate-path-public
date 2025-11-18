import './Header.css';
import LoginButton from './LoginButton/LoginButton';

export default function Header() {
  return (
    <div className="top-bar">
      <div className="logo">PlatePath</div>
      <LoginButton />
    </div>
  );
}
