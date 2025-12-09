"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/" className="logo-text">
          Neon Notes
        </Link>
      </div>

      <div className="navbar-middle" />

      <div className="navbar-right">
        {!session ? (
          <Link href="/login" className="profile-btn">
            Login
          </Link>
        ) : (
          <button className="profile-btn" onClick={() => signOut()}>
            {session.user?.name?.split(" ")[0] || "Logout"}
          </button>
        )}
      </div>
    </nav>
  );
}
