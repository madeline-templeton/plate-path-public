import { useNavigate } from 'react-router-dom';
import './ProfileIcon.css';

export default function ProfileIcon() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/account");
  };

  return (
    <button className="profile-icon-button" onClick={handleClick} aria-label="Profile settings">
      <svg
        className="profile-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
