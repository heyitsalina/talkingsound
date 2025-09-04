export function buildVinylData(artists = [], tracks = [], audioFeaturesById = {}) {
  const artistData = artists.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  const trackData = tracks.map((t) => ({
    id: t.id,
    name: t.name,
    preview_url: t.preview_url,
    audioFeatures: audioFeaturesById[t.id],
  }));

  return { artistData, trackData };
}
