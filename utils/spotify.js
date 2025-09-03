import axios from "axios";

export async function fetchTopArtists(token, limit = 20) {
  const res = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.items.map((a) => ({
    id: a.id,
    name: a.name,
    genres: a.genres,
    popularity: a.popularity,
    followers: a.followers?.total,
    image: a.images?.[0]?.url,
  }));
}

export async function fetchTopTracks(token, limit = 20) {
  const res = await axios.get(
    `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const tracks = res.data.items.map((t) => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map((a) => a.name),
    popularity: t.popularity,
  }));
  const ids = tracks.map(t=>t.id).filter(Boolean).join(",");
  if (!ids) return tracks;
  const featRes = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(()=>({ data: { audio_features: []}}));
  const features = featRes.data.audio_features || [];
  return tracks.map((t,i) => ({ ...t, audio_features: features[i] }));
}
