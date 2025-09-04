# Talking Sound 🎧 — collectible music cards

<img width="1368" height="770" alt="Asset 5" src="https://github.com/user-attachments/assets/29df386b-5ae4-48a1-9428-4fa8bc86207a" />

**Turn your Spotify taste into collectible cards — front = personality, back = interactive vinyl.**  
Talking Sound verwandelt Hörgewohnheiten in ein visuelles, teilbares Statement: Die Vorderseite zeigt deine Musik-Persönlichkeit, die Rückseite eine interaktive Vinyl-Visualisierung mit deinen wichtigsten Statistiken.

---

## Vorschau

**Die 16 Persönlichkeiten**  

<img width="1080" height="1350" alt="Design ohne Titel (3)" src="https://github.com/user-attachments/assets/4e53d487-3b6d-4cdd-86c1-9ee695c6ca89" />



**App-Screenshot**  

<img width="1440" height="767" alt="Bildschirmfoto 2025-09-04 um 16 53 01" src="https://github.com/user-attachments/assets/e39ff2b4-1912-404c-8c3f-7c6d32089c8e" />

---

## Run the demo locally

Sample data is included so you can try the app without a Spotify account or any credentials.

1. Install dependencies
   ```
   npm install
   ```
2. Start the development server
   ```
   npm run dev
   ```
3. Open `http://localhost:3000/app` – the sample artists and tracks will be loaded automatically.

## Using your own Spotify data

To generate a card from your personal listening data you need a Spotify application:

1. Create a `.env.local` file and add your Spotify credentials:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/spotify/callback
   ```
2. Run `npm install` and `npm run dev` and open `http://localhost:3000`.

The card front and back images are already bundled with the project, so no extra setup is required for them. Custom fonts are not included and must be added manually if desired.
