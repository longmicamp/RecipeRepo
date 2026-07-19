import { useState } from "react";
import { login } from "../services/authService";

export function useAuth() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      setToken(data.access_token);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return { token, loading, error, signIn };
}
