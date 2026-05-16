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
              const cleanUsername = username.trim();

              // 1. try to find user
              const existing = await loginWithUsername(cleanUsername);

              // If your current function returns null → create instead
              if (existing) {
                onLogin(existing);
                return;
              }

              // 2. create new user (fallback)
              const newUser = await loginWithUsername(cleanUsername);

              if (!newUser) {
                setError("Failed to create user");
                return;
              }

              onLogin(newUser);
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