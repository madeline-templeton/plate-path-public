import axios from "axios";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import "./Account.css";

/**
 * Account component displays user account information and privacy settings.
 * Allows users to manage their meal plans, personal data, meal preferences,
 * and privacy consent settings.
 * 
 * @returns {JSX.Element} The Account page component
 */
export default function Account(){
    const [plannerExists, setPlannerExists] = useState<boolean>(false);
    const [userInfoInStorage, setUserInfoInStorage] = useState<boolean>(false);
    const [sensitiveDataConsent, setSensitiveDataConsent] = useState<boolean>(false);
    const [generalDataConsent, setGeneralDataConsent] = useState<boolean>(false);
    const [preferencesExist, setPreferencesExist] = useState<boolean>(false);
    const { user: currentUser } = useAuth();

    /**
     * Checks if a meal planner exists for the current user in the backend.
     * Updates plannerExists state based on the result.
     */
    const checkPlanner = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkUserPlannerExists/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                setPlannerExists(true);
            }
        } catch(error){
            alert("Error while fetching planner. Please try again.");
            console.error("Error while checking planner", error);
        }
    }

    /**
     * Deletes the user's meal planner from the backend after confirmation.
     * Displays success/error messages to the user.
     */
    const deletePlanner = async () => {
        if (!window.confirm("Are you sure you want to delete your meal plan? This action cannot be undone.")) {
            return;
        }

        try{
            const token = await auth.currentUser?.getIdToken();
            
            const response = await axios.delete(`http://localhost:8080/deletePlannerForUser`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success){
                alert("Planner deleted successfully!");
                setPlannerExists(false);
            }
        } catch(error){
            alert("Failed to delete planner. Please try again.");
            console.error("Error while deleting planner", error);
        }
    }

    /**
     * Checks if user information (personal data) exists in storage for the current user.
     * Updates userInfoInStorage state based on the result.
     */
    const checkUserInfo = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkIfInfoInStorage/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                setUserInfoInStorage(true);
            }
        } catch (error) {
            alert("Error while fetching user info. Please try again.");
            console.error("Error while checking userInfo", error);
        }
    }

    /**
     * Deletes the user's personal information from the backend after confirmation.
     * Displays success/error messages to the user.
     */
    const deleteUserInfo = async () => {
        if (!window.confirm("Are you sure you want to delete your saved information? This action cannot be undone.")) {
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();

            const response  = await axios.delete("http://localhost:8080/deleteUserInfo", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success){
                alert("Stored data deleted successfully!");
                setUserInfoInStorage(false);
            }
        } catch (error) {
            alert("Error while deleting user info. Please try again.");
            console.error("Error while deleting userInfo", error);
        }
    }

    /**
     * Checks if user meal preferences (liked/disliked meals) exist in storage.
     * Updates preferencesExist state based on the result.
     */
    const checkUserMealPreferences = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkUserMealVotes/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                setPreferencesExist(true);
            }
        } catch (error) {
            alert("Error while fetching meal preferences. Please try again.");
            console.error("Error while getting meal preferences", error);
        }
    }

    /**
     * Deletes the user's meal voting preferences from the backend after confirmation.
     * Displays success/error messages to the user.
     */
    const deleteMealPreferences = async () => {
        if (!window.confirm("Are you sure you want to delete your liked and disliked meals? This action cannot be undone.")) {
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();

            const response  = await axios.delete("http://localhost:8080/deleteUserMealVotes", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success){
                alert("Liked and/or Disliked meals in storage deleted successfully!");
                setPreferencesExist(false);
            }
        } catch (error) {
            alert("Failed to delete meal votes");
            console.error("Error deleting user preferences", error)
        }
    }

    /**
     * Updates user consent preferences for sensitive and general data storage.
     * Updates consent states and sends changes to the backend.
     * 
     * @param {boolean} sensitiveConsentGranted - Whether sensitive data consent is granted
     * @param {boolean} generalConsentGranted - Whether general data consent is granted
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

            if (response.data.success){
                setSensitiveDataConsent(sensitiveConsentGranted);
                setGeneralDataConsent(generalConsentGranted);
            } else {
                alert("Error while updating consent. Please try again.");
            }
        } catch(error){
            console.error("Error while updating consent", error)
            alert("Error while updating consent. Please try again.");
        }
    }

    /**
     * Fetches the user's current consent preferences from the backend.
     * Updates sensitiveDataConsent and generalDataConsent states.
     */
    const getConsent = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/getUserConsent/${currentUser?.id}`);
            if (response.data.exists && response.data.success){
                if (response.data.sensitiveConsent === "granted"){
                    setSensitiveDataConsent(true);
                } else{
                    setSensitiveDataConsent(false);
                }

                if (response.data.generalConsent === "granted"){
                    setGeneralDataConsent(true);
                } else{
                    setGeneralDataConsent(false);
                }
            } 
        } catch(error){
            alert("Error while fetching consent. Please try again.");
            console.error("Error while getting consent", error)
        }
    }

    useEffect(() => {
        if (currentUser) {
            getConsent();
            checkPlanner();
            checkUserInfo();
            checkUserMealPreferences();
        } 
    }, [currentUser])

    return (
        <>
            <Header/>
            <main role="main" className="account-page">
                <h1 id="account-page-title" className="account-title">My Account</h1>

                <div className="account-container">
                    {/* User Info Section */}
                    <section className="account-section" aria-labelledby="account-info-heading">
                        <h2 id="account-info-heading" className="section-title">Account Information</h2>
                        <div className="info-card">
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{currentUser?.email || 'Not available'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Planner Status Section */}
                    <section className="account-section" aria-labelledby="meal-plan-heading">
                        <h2 id="meal-plan-heading" className="section-title">Meal Plan Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${plannerExists ? 'active' : 'inactive'}`} aria-hidden="true"></span>
                                <span className="status-text">
                                    {plannerExists ? 'Active meal plan in storage' : 'No meal plan found'}
                                </span>
                            </div>
                            
                            {plannerExists && (
                                <button 
                                    className="delete-button"
                                    onClick={deletePlanner}
                                    aria-label="Delete your meal plan. This action requires confirmation and cannot be undone."
                                >
                                    Delete Meal Plan
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Meal Preferences Status Section */}
                    <section className="account-section" aria-labelledby="voted-meals-heading">
                        <h2 id="voted-meals-heading" className="section-title">Voted Meals Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${preferencesExist ? 'active' : 'inactive'}`} aria-hidden="true"></span>
                                <span className="status-text">
                                    {preferencesExist ? 'Liked and/ or disliked meals in storage' : 'No liked or disliked meals found'}
                                </span>
                            </div>
                            
                            {preferencesExist && (
                                <button 
                                    className="delete-button"
                                    onClick={deleteMealPreferences}
                                    aria-label="Delete your liked and disliked meals. This action requires confirmation and cannot be undone."
                                >
                                    Delete Liked and/ or Disliked Meals
                                </button>
                            )}
                        </div>
                    </section>


                    {/* Stored Data Section */}
                    <section className="account-section" aria-labelledby="saved-info-heading">
                        <h2 id="saved-info-heading" className="section-title">Saved Information Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${userInfoInStorage ? 'active' : 'inactive'}`} aria-hidden="true"></span>
                                <span className="status-text">
                                    {userInfoInStorage ? 'Personal data in storage' : 'No personal data in storage'}
                                </span>
                            </div>
                            
                            {userInfoInStorage && (
                                <button 
                                    className="delete-button"
                                    onClick={deleteUserInfo}
                                    aria-label="Delete your personal data. This action requires confirmation and cannot be undone."
                                >
                                    Delete Personal Data
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Data Consent Section */}
                    <section className="account-section" aria-labelledby="privacy-settings-heading">
                        <h2 id="privacy-settings-heading" className="section-title">Privacy Settings</h2>
                        <div className="consent-card">
                            <div className="consent-info">
                                <p id="consent-description" className="consent-description">
                                    Allow PlatePath to store your meal plans and preferences for a personalised experience. 
                                    Sensitive data relates all of your inputted personal data, while general data encompasses 
                                    everything generated by us, such as your planner and meal preferences. 
                                </p>
                            </div>

                           {/* Separate toggle containers for each consent type */}
                            <div className="toggle-container" role="group" aria-describedby="consent-description">
                                <label htmlFor="general-consent-toggle" className="toggle-label">General Storage Consent</label>
                                <div className="toggle-switch">
                                    <input
                                        id="general-consent-toggle"
                                        type="checkbox"
                                        role="switch"
                                        aria-checked={generalDataConsent}
                                        checked={generalDataConsent}
                                        onChange={(e) => updateConsent(sensitiveDataConsent, e.target.checked)}
                                        aria-label="Toggle general storage consent for meal plans and preferences"
                                    />
                                    <span className="toggle-slider" aria-hidden="true"></span>
                                </div>
                            </div>

                            <div className="toggle-container" role="group" aria-describedby="consent-description">
                                <label htmlFor="sensitive-consent-toggle" className="toggle-label">Sensitive Data Storage Consent</label>
                                <div className="toggle-switch">
                                    <input
                                        id="sensitive-consent-toggle"
                                        type="checkbox"
                                        role="switch"
                                        aria-checked={sensitiveDataConsent}
                                        checked={sensitiveDataConsent}
                                        onChange={(e) => updateConsent(e.target.checked, generalDataConsent)}
                                        aria-label="Toggle sensitive data storage consent for personal information"
                                    />
                                    <span className="toggle-slider" aria-hidden="true"></span>
                                </div>
                            </div>
                            
                            <p className="consent-status" aria-live="polite">
                                Consent for general data storage: <strong>{generalDataConsent ? 'Granted' : 'Revoked'}</strong>
                            </p>
                            <p className="consent-status" aria-live="polite">
                                Consent for sensitive data storage: <strong>{sensitiveDataConsent ? 'Granted' : 'Revoked'}</strong>
                            </p>
                        </div>
                    </section>
                </div>

            </main>
            <Footer/>
        </>
    )
}