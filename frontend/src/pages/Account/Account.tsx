import axios from "axios";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import "./Account.css";


export default function Account(){
    const [plannerExists, setPlannerExists] = useState<boolean>(false);
    const [userInfoInStorage, setUserInfoInStorage] = useState<boolean>(false);
    const [dataConsent, setDataConsent] = useState<boolean>(false);
    const [preferencesExist, setPreferencesExist] = useState<boolean>(false);
    const { user: currentUser } = useAuth();

    const checkPlanner = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkUserPlannerExists/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                console.log("Planner in Storage");
                setPlannerExists(true);
            }
        } catch(error){
            console.error(error, "Failed to check planner")
        }
    }

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
            console.error(error, "Failed to get planner");
            alert("Failed to delete planner. Please try again.");

        }
    }

    const checkUserInfo = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkIfInfoInStorage/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                console.log("User Info in Storage");
                setUserInfoInStorage(true);
            }
        } catch (error) {
            console.error(error, "Failed to check userInfo")
        }
    }

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
            alert("Failed to delete stored information");
            console.error(error, "Failed to delete userInfo. Please try again.");
        }
    }

    const checkUserMealPreferences = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkUserMealVotes/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
                console.log("Meal preferences in storage");
                setPreferencesExist(true);
            }
        } catch (error) {
            console.error(error, "Failed to check meal preferences")
        }
    }

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
            console.error(error, "Failed to delete meal preferences. Please try again.");
        }
    }

    const updateConsent = async (consentGranted: boolean) => {
        try{
            const token = await auth.currentUser?.getIdToken();

            const response = await axios.put("http://localhost:8080/updateUserConsent", {
                consent: consentGranted ? "granted" : "revoked",
                providedUserId: currentUser?.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success){
                setDataConsent(consentGranted);
                console.log(`Data consent ${consentGranted ? 'granted' : 'revoked'}`);
            } else {
                alert("Error while updating consent. Please try again.");
            }
        } catch(error){
            console.error(error, "Error while updating consent");
            alert("Error while updating consent. Please try again.");
        }
    }

    const getConsent = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/getUserConsent/${currentUser?.id}`);

            if (response.data.exists && response.data.success){
                if (response.data.consent.consent === "granted"){
                    setDataConsent(true);
                } else{
                    setDataConsent(false);
                }
                console.log("Consent updated successfully");
            } 
        } catch(error){
            console.error(error, "Error while fetching consent")
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
            <div className="account-page">
                <h2 className="account-title">My Account</h2>

                <div className="account-container">
                    {/* User Info Section */}
                    <div className="account-section">
                        <h2 className="section-title">Account Information</h2>
                        <div className="info-card">
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{currentUser?.email || 'Not available'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Planner Status Section */}
                    <div className="account-section">
                        <h2 className="section-title">Meal Plan Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${plannerExists ? 'active' : 'inactive'}`}></span>
                                <span className="status-text">
                                    {plannerExists ? 'Active meal plan in storage' : 'No meal plan found'}
                                </span>
                            </div>
                            
                            {plannerExists && (
                                <button 
                                    className="delete-button"
                                    onClick={deletePlanner}
                                >
                                    Delete Meal Plan
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Meal Preferences Status Section */}
                    <div className="account-section">
                        <h2 className="section-title">Voted Meals Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${preferencesExist ? 'active' : 'inactive'}`}></span>
                                <span className="status-text">
                                    {preferencesExist ? 'Liked and/ or disliked meals in storage' : 'No liked or disliked meals found'}
                                </span>
                            </div>
                            
                            {preferencesExist && (
                                <button 
                                    className="delete-button"
                                    onClick={deleteMealPreferences}
                                >
                                    Delete Liked and/ or Disliked Meals
                                </button>
                            )}
                        </div>
                    </div>


                    {/* Stored Data Section */}
                    <div className="account-section">
                        <h2 className="section-title">Saved Information Status</h2>
                        <div className="status-card">
                            <div className="status-indicator">
                                <span className={`status-dot ${userInfoInStorage ? 'active' : 'inactive'}`}></span>
                                <span className="status-text">
                                    {userInfoInStorage ? 'Personal data in storage' : 'No personal data in storage'}
                                </span>
                            </div>
                            
                            {userInfoInStorage && (
                                <button 
                                    className="delete-button"
                                    onClick={deleteUserInfo}
                                >
                                    Delete Personal Data
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Data Consent Section */}
                    <div className="account-section">
                        <h2 className="section-title">Privacy Settings</h2>
                        <div className="consent-card">
                            <div className="consent-info">
                                <p className="consent-description">
                                    Allow PlatePath to store your meal plans and preferences for a personalised experience.
                                </p>
                            </div>
                            <div className="toggle-container">
                                <span className="toggle-label">Data Storage Consent</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={dataConsent}
                                        onChange={(e) => updateConsent(e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <p className="consent-status">
                                Status: <strong>{dataConsent ? 'Granted' : 'Revoked'}</strong>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <Footer/>
        </>
    )
}