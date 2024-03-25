import { getFilm } from "./_lib/lettterboxed-api.mjs";

export default async function handler(req, res) {
  try {
    const film = await getFilm();

    console.log(film);

    return res.status(200).json({
      film: film.status === "fulfilled" ? film.value : {},
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}
