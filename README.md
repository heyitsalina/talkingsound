# Talking Sounds — Starter Repo

Quick: unzip and run locally for your MVP.

Steps:
1. Copy your 16 front PNGs into `public/cards/fronts/` using the naming convention:
   the-ace.png, the-seeker.png, the-nostalgic.png, the-rebel.png, the-pulse.png,
   the-dreamer.png, the-poet.png, the-virtuoso.png, the-loner.png, the-romantic.png,
   the-firestarter.png, the-prophet.png, the-shadow.png, the-siren.png, the-shapeshifter.png, the-oracle.png

2. Copy at least one back PNG into `public/cards/backs/back.png` (or per-personality: `the-ace-back.png`, ...)

3. Create a `.env.local` file with your Spotify credentials:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=<your-client-id>
   SPOTIFY_CLIENT_ID=<your-client-id>
   SPOTIFY_CLIENT_SECRET=<your-client-secret>
   ```

4. Install & run:
   ```
   npm install
   npm run dev
   ```

Open `http://127.0.0.1:3000`.

This zip contains the starter code. Images/fonts are placeholders and must be added manually.
