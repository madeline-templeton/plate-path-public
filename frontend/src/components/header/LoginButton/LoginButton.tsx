import { useNavigate } from 'react-router-dom';
import './LoginButton.css';

export default function LoginButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <button className="login-button" onClick={handleClick}>
      Sign In
    </button>
  );
}
