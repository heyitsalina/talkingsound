import { PERSONALITIES } from "./mapping";

// normalize any string to the matching asset file name
const NORMALIZE = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9äöüß ]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// build a lookup map for all 16 personality fronts
const FRONT_MAP = PERSONALITIES.reduce((acc, name) => {
  const key = NORMALIZE(name);
  acc[key] = `/cards/fronts/${key}.png`;
  return acc;
}, {});

export function frontPathFor(personality) {
  if (!personality) return "/cards/fronts/default-front.png";
  const key = NORMALIZE(personality);
  return FRONT_MAP[key] || "/cards/fronts/default-front.png";
}

export function backPathFor() {
  return "/cards/backs/back.png";
}
