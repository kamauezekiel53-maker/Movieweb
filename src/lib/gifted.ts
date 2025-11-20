export const GIFTED_BASE = process.env.GIFTED_BASE || "https://movieapi.giftedtech.co.ke/api";

export async function giftedSearch(query: string, page = 1) {
  const q = encodeURIComponent(query);
  const url = `${GIFTED_BASE}/search/${q}?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GiftedTech search failed: ${res.status}`);
  return res.json();
}

export async function giftedGetMovie(id: string) {
  const url = `${GIFTED_BASE}/movie/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GiftedTech getMovie failed: ${res.status}`);
  return res.json();
}

export async function giftedGetSources(id: string) {
  const url = `${GIFTED_BASE}/sources/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GiftedTech getSources failed: ${res.status}`);
  return res.json();
}