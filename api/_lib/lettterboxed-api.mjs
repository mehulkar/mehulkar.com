import Parser from "rss-parser";
import { shuffle } from "./_utils.mjs";

const URL = "https://letterboxd.com/mehulkar/rss/";

export async function getFilm() {
  const json = await new Parser().parseURL(URL);
  const last10Films = json.items.slice(0, 10);

  const latestFilm = shuffle(last10Films)[0];

  console.log("lastest film", latestFilm);

  const { title, isoDate, link } = latestFilm;

  const linkWithoutUser = link.replace("/mehulkar/", "/");

  const STAR_CHAR = "★";

  const matched = title.match(/(?<name>.*), (?<year>\d{4}) - (?<stars>★?.*)/);

  const { name, year, stars } = matched.groups;

  let rating = 0;
  stars.split("").forEach((character) => {
    if (character === STAR_CHAR) {
      rating++;
    } else if (character === "½") {
      rating += 0.5;
    }
  });

  return {
    name,
    rating,
    ratingString: stars,
    year,
    timestamp: isoDate,
    url: linkWithoutUser,
  };
}