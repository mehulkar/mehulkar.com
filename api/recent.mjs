import { getFilm } from "./_lib/lettterboxed-api.mjs";
import { getAnnotation } from "./_lib/feedly-api.mjs";
import { getTweet } from "./_lib/twitter-api.mjs";

export default async function handler(req, res) {
  try {
    const [film, annotation, tweet] = await Promise.all([
      getFilm(),
      getAnnotation(),
      getTweet(),
    ]);

    return res.status(200).json({
      film,
      annotation,
      tweet,
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}
