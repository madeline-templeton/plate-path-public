import { useNavigate } from 'react-router-dom';
import './LoginButton.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from '../../../services/firebase';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


export default function LoginButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out.");
    }
  };

  return (
    <button className="login-button" onClick={handleClick}>
      {user ? "Sign Out" : "Sign In"}
    </button>
  );
}
