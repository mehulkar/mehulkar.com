import { getFilm } from "./_lib/lettterboxed-api.mjs";
import { getAnnotation } from "./_lib/feedly-api.mjs";
import { getTweet } from "./_lib/twitter-api.mjs";

export default async function handler(req, res) {
  try {
    const [film, annotation, tweet] = await Promise.allSettled([
      getFilm(),
      getAnnotation(),
      getTweet(),
    ]);

    console.log(film, annotation, tweet);

    return res.status(200).json({
      film: film.status === "fulfilled" ? film.value : {},
      annotation: annotation.status === "fulfilled" ? annotation.value : {},
      tweet: tweet.status === "fulfilled" ? tweet.value : {},
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}
