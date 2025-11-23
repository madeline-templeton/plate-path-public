import { useNavigate } from 'react-router-dom';
import './OurStory.css';

export default function OurStory() {
  const navigate = useNavigate();

  return (
    <div className="our-story-container">
      <h1 className="welcome-title">Welcome to PlatePath!</h1>
      
      <p className="welcome-subtitle">
        We take the stress out of meal planning<br />
        and help you reach your dietary goals
      </p>
      
      <div className="action-links">
        <p className="action-text">
          <span className="link-text">Generate your plan now</span>. Already have a plan?<br />
          Go to your <span className="link-text" onClick={() => navigate('/calendar')}>calendar</span>!
        </p>
      </div>
    </div>
  );
}
