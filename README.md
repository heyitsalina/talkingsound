# Talking Sounds — Starter Repo

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
