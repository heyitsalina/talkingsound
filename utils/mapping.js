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

const PERSONALITY_FEATURE_TEMPLATES = {
  "The Ace": { energy: 0.6, valence: 0.5, danceability: 0.5, tempo: 110, instrumentalness: 0.2 },
  "The Seeker": { energy: 0.4, valence: 0.4, danceability: 0.4, tempo: 100, instrumentalness: 0.3 },
  "The Nostalgic": { energy: 0.3, valence: 0.5, danceability: 0.3, tempo: 90, instrumentalness: 0.2 },
  "The Rebel": { energy: 0.8, valence: 0.3, danceability: 0.5, tempo: 130, instrumentalness: 0.1 },
  "The Pulse": { energy: 0.9, valence: 0.5, danceability: 0.8, tempo: 128, instrumentalness: 0.1 },
  "The Dreamer": { energy: 0.2, valence: 0.6, danceability: 0.2, tempo: 80, instrumentalness: 0.4 },
  "The Poet": { energy: 0.4, valence: 0.6, danceability: 0.3, tempo: 85, instrumentalness: 0.3 },
  "The Virtuoso": { energy: 0.5, valence: 0.5, danceability: 0.4, tempo: 100, instrumentalness: 0.7 },
  "The Loner": { energy: 0.3, valence: 0.4, danceability: 0.2, tempo: 70, instrumentalness: 0.5 },
  "The Romantic": { energy: 0.4, valence: 0.8, danceability: 0.4, tempo: 100, instrumentalness: 0.2 },
  "The Firestarter": { energy: 0.85, valence: 0.5, danceability: 0.7, tempo: 140, instrumentalness: 0.1 },
  "The Prophet": { energy: 0.5, valence: 0.5, danceability: 0.6, tempo: 110, instrumentalness: 0.2 },
  "The Shadow": { energy: 0.2, valence: 0.2, danceability: 0.2, tempo: 60, instrumentalness: 0.3 },
  "The Siren": { energy: 0.6, valence: 0.7, danceability: 0.5, tempo: 100, instrumentalness: 0.1 },
  "The Shapeshifter": { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 110, instrumentalness: 0.5 },
  "The Oracle": { energy: 0.4, valence: 0.4, danceability: 0.4, tempo: 90, instrumentalness: 0.6 },
};

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

export function mapToPersonalityImproved(
  topArtists = [],
  topTracks = [],
  audioFeaturesById = {},
  weights = { genre: 0.4, artist: 0.3, features: 0.3 }
) {
  const genreScores = {}, artistScores = {}, featureScores = {}, combined = {};
  PERSONALITIES.forEach((p) => {
    genreScores[p] = 0;
    artistScores[p] = 0;
    featureScores[p] = 0;
    combined[p] = 0;
  });

  const totalTracks = topTracks.length || 1;
  const weightForArtist = (artist) => {
    const pop = (artist.popularity || 0) / 100;
    const followers = artist.followers || 0;
    const followerScore = Math.min(Math.log10(followers + 1) / 6, 1);
    const presence =
      topTracks.filter((t) => t.artists?.includes(artist.name)).length / totalTracks;
    return clamp((pop + followerScore + presence) / 3);
  };

  topArtists.forEach((artist) => {
    const weight = weightForArtist(artist);
    const matched = new Set();
    (artist.genres || []).forEach((genre) => {
      const g = genre.toLowerCase();
      for (const key in GENRE_TO_PERSONALITY) {
        if (g.includes(key)) matched.add(GENRE_TO_PERSONALITY[key]);
      }
    });
    if (matched.size === 0) return;
    const share = weight / matched.size;
    matched.forEach((p) => {
      genreScores[p] += 1;
      artistScores[p] += share;
    });
  });

  const normalize = (obj) => {
    const max = Math.max(...Object.values(obj), 0);
    if (max > 0) {
      for (const k in obj) obj[k] = obj[k] / max;
    } else {
      for (const k in obj) obj[k] = 0;
    }
  };
  normalize(genreScores);
  normalize(artistScores);

  const features = topTracks
    .map((t) => audioFeaturesById[t.id] || t.audio_features)
    .filter(Boolean);
  const avg = {
    energy: 0,
    valence: 0,
    danceability: 0,
    tempo: 0,
    instrumentalness: 0,
  };
  features.forEach((f) => {
    avg.energy += f.energy || 0;
    avg.valence += f.valence || 0;
    avg.danceability += f.danceability || 0;
    avg.tempo += f.tempo || 0;
    avg.instrumentalness += f.instrumentalness || 0;
  });
  if (features.length) {
    avg.energy /= features.length;
    avg.valence /= features.length;
    avg.danceability /= features.length;
    avg.tempo /= features.length;
    avg.instrumentalness /= features.length;
  }

  for (const p of PERSONALITIES) {
    const t = PERSONALITY_FEATURE_TEMPLATES[p];
    const diff =
      Math.abs(avg.energy - t.energy) +
      Math.abs(avg.valence - t.valence) +
      Math.abs(avg.danceability - t.danceability) +
      Math.abs((avg.tempo - t.tempo) / 200) +
      Math.abs(avg.instrumentalness - t.instrumentalness);
    featureScores[p] = clamp(1 - diff / 5);
  }

  for (const p of PERSONALITIES) {
    combined[p] =
      (weights.genre ?? 0.4) * genreScores[p] +
      (weights.artist ?? 0.3) * artistScores[p] +
      (weights.features ?? 0.3) * featureScores[p];
  }

  let bestPersonality = PERSONALITIES[0];
  let bestScore = combined[bestPersonality];
  for (const p of PERSONALITIES) {
    if (combined[p] > bestScore) {
      bestScore = combined[p];
      bestPersonality = p;
    }
  }

  return {
    personality: bestPersonality,
    score: bestScore,
    breakdown: { genreScores, featureScores, combined },
  };
}
