import { useState } from "react";
import type { SubmitEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from 'react-router';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token, loading, error, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    // Call the signIn function from the useAuth hook
    await signIn(email, password);
    if (token) {
      console.log("Login successful! Token:", token);
      navigate('/home'); // Redirect to the dashboard or another page after successful login
    }

    console.log("Logging in with", { email });
  };

  return (
    <main className="login-page">
      <div className="login-image">
        <h1 className="login-site-name">RepiBee</h1>
        <h2 className="company-name">LPI Inc.</h2>
      </div>
      <div className="login-form-container">
        {loading ? (
          <Loader />
        ) : (
          <form className="login-card" onSubmit={handleSubmit}>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Your recipe book, right where you left it.
            </p>

            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            {(errorMessage || error) && (
              <p className="login-error">{errorMessage || error}</p>
            )}

            <button type="submit" className="login-button">
              Sign in
            </button>

            <p className="login-footer">
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

function Loader() {
  return (
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="40"
      visible={true}
    />
  );
}

export default Login;
