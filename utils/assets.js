const NORMALIZE = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9äöüß ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export function frontPathFor(personality) {
  if (!personality) return "/cards/fronts/default-front.png";
  const key = NORMALIZE(personality);
  return `/cards/fronts/${key}.png`;
}

export function backPathFor() {
  return "/cards/backs/back.png";
}
