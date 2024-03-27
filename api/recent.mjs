import { getFilm } from "../lib/letterboxd.mjs";

export default async function handler(req, res) {
  try {
    const film = await getFilm();
    return res.status(200).json({ film });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
}
