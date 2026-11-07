import { useState } from "react";
import type { SubmitEvent } from "react";
import { useAuth } from "react-oidc-context";
import "./Login.css";
import { RotatingLines } from "react-loader-spinner";
function Login() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "20qf3imk30mr42205id1b1h1da";
    const logoutUri = "<logout uri>";
    const cognitoDomain =
      "https://ap-southeast-2rcqwarb2z.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    if (auth.isLoading) {
      return <div>Loading...</div>;
    }

    if (auth.error) {
      return <div>Encountering error... {auth.error.message}</div>;
    }

    // // Call the signIn function from the useAuth hook
    // await signIn(email, password);
    // if (token) {
    //   console.log("Login successful! Token:", token);
    // }
  };

  return (
    <main className="login-page">
      <div className="login-image">
        <h1 className="login-site-name">RepiMee</h1>
        <h2 className="company-name">LPI Inc.</h2>
      </div>
      <div className="login-form-container">
        {auth.isLoading ? (
          <Loader />
        ) : (
          <form className="login-card" onSubmit={handleSubmit}>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">
              Your recipe book, right where you left it.
            </p>

            {(errorMessage || auth.error) && (
              <p className="login-error">{errorMessage}</p>
            )}

            <div>
              <button
                onClick={() => auth.signinRedirect()}
                className="login-button"
              >
                Sign in or up
              </button>
            </div>
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
