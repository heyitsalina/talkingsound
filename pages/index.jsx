// pages/index.jsx
import React from "react";
import Link from "next/link";

const SCOPES = ["user-top-read"].join(" ");
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

export default function Home() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}`;

  return (
    <main className="main-container">
      <img src="/logo/logo.png" alt="Talking Sound logo" className="logo" />
      <h1> Welcome to Talking Sound! </h1>
      <p>
        Log in with your Spotify & turn your music taste into a collectible card — front is all about vibes, back is an interactive vinyl of your statistics.
        Talking Sound explores 16 different personalities based on your listening habits.. are you ready to know who YOU really are?
        Have fun, share your card with friends and don't forget to put on your best playlist meanwhile 🌞
      </p>

      <div className="auth-box" aria-hidden={false}>
        <a className="auth-btn" href={authUrl} role="button">
          Login with Spotify
        </a>
      </div>
      <nav className="page-links">
        <Link href="/privacy">Data Privacy</Link> | <Link href="/kontakt">Kontakt</Link>
      </nav>
    </main>
  );
}
