export const PERSONALITIES = [
  "The Ace","The Seeker","The Nostalgic","The Rebel","The Pulse",
  "The Dreamer","The Poet","The Virtuoso","The Loner","The Romantic",
  "The Firestarter","The Prophet","The Shadow","The Siren","The Shapeshifter","The Oracle"
];

const GENRE_TO_PERSONALITY = {
  "indie": "The Ace",
  "indie pop": "The Ace",
  "singer-songwriter":"The Poet",
  "classical":"The Virtuoso",
  "ambient":"The Dreamer",
  "electronic":"The Pulse",
  "house":"The Pulse",
  "techno":"The Pulse",
  "hip hop":"The Rebel",
  "rap":"The Rebel",
  "punk":"The Firestarter",
  "metal":"The Firestarter",
  "r&b":"The Siren",
  "soul":"The Romantic",
  "folk":"The Nostalgic",
  "jazz":"The Virtuoso",
  "experimental":"The Shapeshifter",
  "dark":"The Shadow"
};

export function mapToPersonality(topArtists = [], topTracks = []) {
  const genreList = (topArtists.flatMap(a => a.genres || []).map(g => g.toLowerCase()));
  for (const g of Object.keys(GENRE_TO_PERSONALITY)) {
    if (genreList.some(x => x.includes(g))) return GENRE_TO_PERSONALITY[g];
  }

  const feats = topTracks.map(t => t.audio_features).filter(Boolean);
  if (feats.length) {
    const avg = feats.reduce((acc, f) => {
      acc.energy += f.energy || 0; acc.valence += f.valence || 0; acc.dance += f.danceability || 0;
      return acc;
    }, { energy: 0, valence: 0, dance: 0 });
    avg.energy /= feats.length; avg.valence /= feats.length; avg.dance /= feats.length;
    if (avg.energy > 0.75 && avg.dance > 0.6) return "The Pulse";
    if (avg.valence < 0.3 && avg.energy < 0.4) return "The Shadow";
    if (avg.valence > 0.7 && avg.energy < 0.5) return "The Romantic";
    if (avg.dance > 0.7 && avg.energy > 0.6) return "The Firestarter";
  }

  const hash = topArtists.map(a => a.name.length).reduce((a,b)=>a+b, 0);
  return PERSONALITIES[hash % PERSONALITIES.length];
}
