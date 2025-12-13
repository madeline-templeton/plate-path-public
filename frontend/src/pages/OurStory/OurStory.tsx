import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PrivacyConsentModal } from '../../components/PrivacyConsentModal/PrivacyConsentModal';
import './OurStory.css';
import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

/**
 * OurStory component displays the landing page with team information
 * and handles privacy consent modal for new users.
 * 
 * @returns {JSX.Element} The OurStory page component
 */
export default function OurStory() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const isNewSignup = localStorage.getItem('showPrivacyConsent');
    const hasSeenConsent = localStorage.getItem('privacyConsentSeen');
    
    if (isNewSignup === 'true' && !hasSeenConsent) {
      setShowModal(true);
      localStorage.removeItem('showPrivacyConsent');
    }
  }, []);

  /**
   * Handles user acceptance of privacy consent.
   * Updates local storage and sends consent status to backend.
   */
  const handleAccept = async () => {
    localStorage.setItem('privacyConsentSeen', 'true');
    await updateConsent(true, true);
    setShowModal(false);
  };

  /**
   * Handles user rejection of privacy consent.
   * Updates local storage and sends consent status to backend.
   */
  const handleReject = async () => {
    localStorage.setItem('privacyConsentSeen', 'true');
    await updateConsent(false, true);
    setShowModal(false);
  };

  /**
   * Updates user consent preferences in the backend.
   * 
   * @param {boolean} sensitiveConsentGranted - Whether sensitive data consent was granted
   * @param {boolean} generalConsentGranted - Whether general data consent was granted
   * @throws {Error} When consent update fails or user is not authenticated
   */
  const updateConsent = async (sensitiveConsentGranted: boolean, generalConsentGranted: boolean) => {
  try{
    const token = await auth.currentUser?.getIdToken();

    const response = await axios.put("http://localhost:8080/updateUserConsent", {
      sensitiveConsent: sensitiveConsentGranted ? "granted" : "revoked",
      generalConsent: generalConsentGranted ? "granted" : "revoked",
      providedUserId: currentUser?.id
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.data.success){
      throw new Error("Failed to update consent preferences");
    }
  } catch(error){
    console.error("Error while updating consent:", error);
    alert("Error while updating consent. Please try again.");
    // Do not re-throw error to avoid unhandled rejection in tests
  }
  }

  return (
    <div className="our-story-container">
      <main role="main">
        {/* INTRO SECTION */}
        <section aria-labelledby="intro-heading" className="intro-section">
          <h1 id="intro-heading" className="welcome-title">Welcome to PlatePath!</h1>
          
          <p className="welcome-subtitle">
            We take the stress out of meal planning<br />
            and help you reach your dietary goals
          </p>
          
          <div className="action-links">
            <p className="action-text">
              <span 
                className="link-text" 
                onClick={() => navigate('/generate-plan')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/generate-plan')}
                aria-label="Navigate to Generate Your Plan page to start creating your personalized meal plan"
              >
                Generate your plan now
              </span>. Already have a plan?<br />
              Go to your{' '}
              <span 
                className="link-text" 
                onClick={() => navigate('/calendar')}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/calendar')}
                aria-label="View your meal plan calendar"
              >
                calendar
              </span>!
            </p>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section aria-labelledby="about-heading" className="about-us-section">
          <h2 id="about-heading" className="about-us-title">About Us</h2>
          
          {/* Team Members */}
          <div className="team-members">
            <div className="team-member">
              <img 
                src="/images/team/maddie-templeton.webp"
                alt="Photo of Maddie Templeton"
                className="member-photo member-photo-zoom-out"
              />
              <h3 className="member-name">Maddie Templeton</h3>
              <p className="member-role">Co-founder & Backend Developer</p>
            </div>
            <div className="team-member">
              <img 
                src="/images/team/erik-estienne.webp"
                alt="Photo of Erik Estienne"
                className="member-photo"
              />
              <h3 className="member-name">Erik Estienne</h3>
              <p className="member-role">Co-founder & Full Stack Developer</p>
            </div>
            <div className="team-member">
              <img 
                src="/images/team/elizabeth-sessa.webp"
                alt="Photo of Elizabeth Sessa"
                className="member-photo"
              />
              <h3 className="member-name">Elizabeth Sessa</h3>
              <p className="member-role">Co-founder & Frontend Developer</p>
            </div>
          </div>

          {/* Bio Text */}
          <div className="bio-text">
            <p>
              The creators of PlatePath are Maddie Templeton, Erik Estienne, and Elizabeth Sessa. 
              They are all sophomore student-athletes at Brown University in Providence, Rhode Island. 
              Maddie is a part of the Women's Soccer team, Erik is on the Men's Rugby 
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
        </section>
      </main>

      {/* Privacy Consent Modal */}
      <PrivacyConsentModal 
        isOpen={showModal}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
