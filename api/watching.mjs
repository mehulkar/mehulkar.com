import Parser from "rss-parser";

const URL = "https://letterboxd.com/mehulkar/rss/";

async function getLatestFilm() {
  const json = await new Parser().parseURL(URL);
  const latestFilm = json.items[0];

  console.log(latestFilm);

  const { title } = latestFilm;

  const STAR_CHAR = "★";

  const matched = title.match(/(?<name>.*), (?<year>\d{4}) - (?<stars>★.*)/);

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
  };
}

export default async function handler(req, res) {
  const filmData = await getLatestFilm();
  return res.send(JSON.stringify(filmData));
}
