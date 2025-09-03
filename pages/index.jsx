// pages/index.jsx
import React from "react";

const SCOPES = ["user-top-read"].join(" ");
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

export default function Home() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}`;

  return (
    <main className="main-container">
      <h1> 🃏 Welcome to Talking Sounds! </h1>
      <p>
        Log in with your Spotify & turn your top tracks into your collectible card — front is all about vibes, back is an interactive vinyl of your stats.
        Have fun, share your card with friends and don't forget to put on your best playlist meanwhile 🌞 
      </p>

      <div className="auth-box" aria-hidden={false}>
        <a className="auth-btn" href={authUrl} role="button">
          Login with Spotify
        </a>
      </div>
    </main>
  );
}
