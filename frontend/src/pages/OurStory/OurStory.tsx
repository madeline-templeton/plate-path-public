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
          <span className="link-text" onClick={() => navigate('/generate-plan')}>Generate your plan now</span>. Already have a plan?<br />
          Go to your <span className="link-text" onClick={() => navigate('/calendar')}>calendar</span>!
        </p>
      </div>

      {/* About Us Section */}
      <div className="about-us-section">
        <h2 className="about-us-title">About Us</h2>
        
        {/* Team Members */}
        <div className="team-members">
          <div className="team-member">
            <h3 className="member-name">Maddie Templeton</h3>
            <div className="member-photo-placeholder"></div>
          </div>
          <div className="team-member">
            <h3 className="member-name">Erik Estienne</h3>
            <div className="member-photo-placeholder"></div>
          </div>
          <div className="team-member">
            <h3 className="member-name">Elizabeth Sessa</h3>
            <div className="member-photo-placeholder"></div>
          </div>
        </div>

        {/* Bio Text */}
        <div className="bio-text">
          <p>
            The creators of PlatePath are Maddie Templeton, Erik Estienne, and Elizabeth Sessa. 
            They are all sophomore student-athletes at Brown University in Providence, Rhode Island. 
            Maddie is a part of the Women's Soccer team, Erik is apart of the of the Men's Rugby 
            team, and Elizabeth plays for the Women's Volleyball team. When tasked with creating a 
            website for their Software Engineering course, the three were motivated by their 
            experiences as student-athletes to create a meal plan generating website. They know 
            first-hand how easy it is for intentional eating can be cast aside when energy is low and, 
            consequently, how much their quality of life can be effected. They sought out to craft a 
            convenient, personalized solution to that problem.
          </p>
          <p>
            PlatePath factors in users' age, height, weight, dietary goals, activity level, and 
            dietary restrictions to create a meal plan just for them. Users can choose from one week, 
            two week, and four week plans depending on what works best with their schedule. Users 
            will then be given a calendar laying out three meals a day that they can alter if desired. 
            Our algorithm will take into account users' votes towards specific meals for future meal 
            plans in hopes of maximum personalization. PlatePath is for anyone who wants to relieve 
            the stress of planning out their meals everyday without sacrificing their dietary goals!
          </p>
        </div>
      </div>
    </div>
  );
}
