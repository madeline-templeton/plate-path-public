import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword,} from "firebase/auth";
import { auth } from '../../services/firebase';
import SimpleHeader from '../../components/simpleHeader/simpleHeader';

/**
 * Login component handles user authentication (sign in and registration).
 * Displays a form for email/password authentication and toggles between
 * login and registration modes.
 * 
 * @returns {JSX.Element} The Login page component
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles authentication form submission for both sign in and registration.
   * For new registrations, sets a flag to show the privacy consent modal.
   * Navigates to home page on successful authentication.
   * 
   * @param {React.FormEvent} e - The form submission event
   * @throws {Error} When authentication fails (displays error message to user)
   */
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem('showPrivacyConsent', 'true');
        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Signed in successfully!");
      }

      navigate("/");
    } catch (error: any) {
      alert(error.message || "Authentication failed.");
      throw error;
    }
  };

  return (
    <>
    <SimpleHeader />
      <div className="login-page">
        <div className="login-container">
          <h1 className="login-title">
            {isRegistering? "Create Account" : "Sign In"}
          </h1>
          <form className="login-form" onSubmit={handleAuth}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="signin-button">
              {isRegistering? "Register" : "Log In"}
            </button>
          </form>
          <p className="create-account-text">
            {isRegistering ? "Already have an account? ": "Don't have an account? "}
            <span className="create-link" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Sign in now!" : "Create one!"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
