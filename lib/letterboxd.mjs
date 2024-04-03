import Parser from "rss-parser";
import { shuffle } from "./utils.mjs";

const URL = "https://letterboxd.com/mehulkar/rss/";
const STAR_CHAR = "★";

function parameterize(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function posterFrom(htmlString) {
  const matched = htmlString.match(/src="(?<url>.*)"/);
  if (!matched) {
    return "";
  }

  return matched.groups.url;
}

function starsToRating(stars) {
  let rating = 0;
  stars.split("").forEach((character) => {
    if (character === STAR_CHAR) {
      rating++;
    } else if (character === "½") {
      rating += 0.5;
    }
  });

  return rating;
}

export async function getAll() {
  const json = await new Parser({
    customFields: {
      item: [
        ["tmdb:movieId", "movieId"],
        ["letterboxd:watchedDate", "watchedDate"],
        ["letterboxd:filmTitle", "filmTitle"],
        ["letterboxd:filmYear", "filmYear"],
      ],
    },
  }).parseURL(URL);

  console.log(json.items);

  return (
    json.items
      // If there's no filmTitle, it's some other activity in the RSS feed (e.g. creating a list)
      .filter((item) => !!item.filmTitle)
      .map((item) => {
        const matched = item.title.match(/.*, \d{4} - (?<stars>★?.*)/);
        const rating = starsToRating(matched.groups.stars);

        return {
          ...item,
          parameterizedFilmTitle: parameterize(item.filmTitle),
          posterURL: posterFrom(item.content),
          filmURL: `https://letterboxd.com/tmdb/${item.movieId}`,
          rating,
        };
      })
  );
}

export async function getFilm() {
  const films = await getAll();
  const last10Films = films.slice(0, 10);
  const film = shuffle(last10Films)[0];
  const { rating, filmURL, filmTitle, filmYear, watchedDate } = film;

  return {
    name: filmTitle,
    year: filmYear,
    timestamp: new Date(watchedDate).toLocaleDateString(),
    rating,
    url: filmURL,
  };
}
