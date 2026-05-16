import { useState } from "react";
import { loginWithUsername } from "../auth";
import type { User } from "../types";

type Props = {
  onLogin: (user: User) => void;
};

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="center-page">
      <div className="card">
        <h1>Enter Username</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. testuser"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          disabled={loading}
          onClick={async () => {
            if (!username.trim()) return;

            setLoading(true);
            setError(null);

            try {
              const user = await loginWithUsername(username);

              if (!user) {
                setError("User not found or failed to login");
                return;
              }

              onLogin(user);
            } catch (err) {
              console.error(err);
              setError("Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}