export function buildVinylData(artists = [], tracks = [], audioFeaturesById = {}) {
  const artistList = artists.slice(0, 8);
  const totalPop = artistList.reduce((acc, a) => acc + (a.popularity || 0), 0) || 1;
  const artistData = artistList.map((a) => ({
    id: a.id,
    name: a.name,
    popularity: a.popularity,
    followers: a.followers,
    genres: a.genres,
    image: a.image,
    weight: (a.popularity || 0) / totalPop,
  }));

  const trackList = tracks.slice(0, 20);
  const trackData = trackList.map((t) => {
    const af = t.audio_features || audioFeaturesById[t.id] || {};
    return {
      id: t.id,
      name: t.name,
      artists: t.artists,
      preview_url: t.preview_url,
      popularity: t.popularity,
      energy: af.energy || 0,
      valence: af.valence || 0,
      danceability: af.danceability || 0,
      tempo: af.tempo || 0,
    };
  });

  return { artistData, trackData };
}

