import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PrivacyConsentModal } from '../../components/PrivacyConsentModal/PrivacyConsentModal';
import './OurStory.css';
import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export default function OurStory() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // Check if this is a new signup (flag set during account creation)
    const isNewSignup = localStorage.getItem('showPrivacyConsent');
    const hasSeenConsent = localStorage.getItem('privacyConsentSeen');
    
    // Show modal only if this is a new signup AND they haven't seen it before
    if (isNewSignup === 'true' && !hasSeenConsent) {
      setShowModal(true);
      // Clear the signup flag so modal doesn't show on subsequent visits
      localStorage.removeItem('showPrivacyConsent');
    }
  }, []);

  const handleAccept = async () => {
    // Save that user has seen the modal and accepted
    localStorage.setItem('privacyConsentSeen', 'true');
    await updateConsent(true, true);
    setShowModal(false);
  };

  const handleReject = async () => {
    // Save that user has seen the modal and rejected
    localStorage.setItem('privacyConsentSeen', 'true');
    await updateConsent(false, true);
    setShowModal(false);
  };

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

        if (response.data.success){
            console.log(`General consent ${generalConsentGranted ? 'granted' : 'revoked'}`);
            console.log(`Sensitive consent ${sensitiveConsentGranted ? 'granted' : 'revoked'}`);
        } else {
            alert("Error while updating consent. Please try again.");
        }
    } catch(error){
        console.error(error, "Error while updating consent");
        alert("Error while updating consent. Please try again.");
    }
  }

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
      </div>

      {/* Privacy Consent Modal */}
      <PrivacyConsentModal 
        isOpen={showModal}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
