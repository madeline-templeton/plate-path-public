import { useNavigate } from 'react-router-dom';
import './LoginButton.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from '../../../services/firebase';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

/**
 * LoginButton component displays a dynamic button that toggles between
 * "Sign In" and "Sign Out" based on the user's authentication state.
 * Navigates to login page when signed out, or signs out when signed in.
 * 
 * @returns {JSX.Element} The LoginButton component
 */
export default function LoginButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  /**
   * Handles button click - navigates to login page if signed out,
   * or initiates sign out if signed in.
   */
  const handleClick = () => {
    if (user) {
      handleSignOut();
    } else{
      navigate("/login");
    } 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  /**
   * Signs out the current user from Firebase authentication.
   * Displays success/error toast notifications.
   * 
   * @throws {Error} When sign out fails
   */
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <button 
      className="login-button" 
      onClick={handleClick}
      aria-label={user ? "Sign out of your account" : "Sign in to your account"}
    >
      {user ? "Sign Out" : "Sign In"}
    </button>
  );
}
