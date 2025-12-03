import axios from "axios";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import "./Account.css";


export default function Account(){
    const [plannerExists, setPlannerExists] = useState<boolean>(false);
    const [dataConsent, setDataConsent] = useState<boolean>(false);
    const { user: currentUser } = useAuth();

    const checkPlanner = async () => {
        try{
            const response = await axios.get(`http://localhost:8080/checkUserPlannerExists/${currentUser?.id}`);

            if (response.data.success && response.data.exists){
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
                alert("Planner delete successfully!");
                setPlannerExists(false);
            }
        } catch(error){
            console.error(error, "Failed to get planner");
            alert("Failed to delete planner. Please try again.");

        }
    }

    const handleConsentToggle = () => {
        setDataConsent(!dataConsent);
        localStorage.setItem("dataStorageConsent", `${!dataConsent}`)
        console.log(`Data consent ${!dataConsent ? 'granted' : 'revoked'}`);
    }

    useEffect(() => {
        if (currentUser) {
            if (localStorage.getItem("dataStorageConsent") === "true"){
                setDataConsent(true);
            }
            checkPlanner();
        } else{
            localStorage.setItem("dataStorageConsent", `false`);
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
                                        onChange={handleConsentToggle}
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