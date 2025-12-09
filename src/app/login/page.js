"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCredentialsLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,        // we’ll redirect manually on success
    });

    if (res?.error) {
      setErrorMsg("Sign in failed. Check your email and password.");
      return;
    }

    // success – go home
    window.location.href = "/";
  }

  return (
    <main
      className="page-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "2rem",
          borderRadius: "18px",
          background: "#11141b",
          boxShadow: "0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        <h1 className="page-title" style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}>
          Log in to Neon Notes
        </h1>

        {/* Google login */}
        <button
          type="button"
          className="submit-btn"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Sign in with Google
        </button>

        <div
          style={{
            margin: "1rem 0",
            textAlign: "center",
            opacity: 0.6,
            fontSize: "0.85rem",
          }}
        >
          — or —
        </div>

        {/* Credentials login */}
        <form onSubmit={handleCredentialsLogin} className="add-note-form">
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && (
            <p style={{ color: "salmon", marginTop: "0.5rem" }}>{errorMsg}</p>
          )}

          <button type="submit" className="submit-btn" style={{ marginTop: "0.5rem" }}>
            Sign in with credentials
          </button>
        </form>

        <p style={{ marginTop: "1rem", opacity: 0.75, fontSize: "0.9rem" }}>
          Don’t have an account?{" "}
          <Link href="/signup" style={{ color: "#0ff", textDecoration: "underline" }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
