"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Signup failed");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="auth-container">
      <h1 className="auth-title">Create Account</h1>

      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input 
          type="password" 
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" className="auth-button">
          Sign Up
        </button>

        <p style={{ marginTop: "1rem", opacity: 0.7 }}>
          Already have an account?{" "}
          <a href="/login" className="auth-link">Log in</a>
        </p>
      </form>
    </main>
  );
}
