import { useState } from 'react';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Dark mode functionality will be implemented later
    console.log('Dark mode toggled:', !isDarkMode);
  };

  return (
    <div className="dark-mode-container">
      <span className="dark-mode-label">Dark Mode</span>
      <button 
        className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={handleToggle}
        aria-label="Toggle dark mode"
      >
        <span className="toggle-text">{isDarkMode ? 'ON' : 'OFF'}</span>
        <div className="toggle-slider"></div>
      </button>
    </div>
  );
}
