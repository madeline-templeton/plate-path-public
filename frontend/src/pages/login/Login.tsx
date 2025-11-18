import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to home page after sign in
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Sign In</h1>
        <form className="login-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p className="create-account-text">
          Don't have an account? <span className="create-link">Create one</span>
        </p>
      </div>
    </div>
  );
}
