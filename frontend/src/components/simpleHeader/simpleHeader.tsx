import { useNavigate } from 'react-router-dom';
import './simpleHeader.css';

export default function SimpleHeader() {
  const navigate = useNavigate();

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate("/")}>PlatePath</div>
      
      <nav className="nav-links">
        <button className="nav-button">our story</button>
        <button className="nav-button">generate your plan</button>
        <button className="nav-button">your calender</button>
      </nav>

        <div className="header-actions"></div>
    </div>
  );
}