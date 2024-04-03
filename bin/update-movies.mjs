import fs from "node:fs";
import path from "node:path";
import { getAll } from "../lib/letterboxd.mjs";

function getContents(item) {
  return `
---
title: "${item.filmTitle}"
date: ${item.watchedDate}
tags: recently-watched, movies
---

<div class="letterboxd-movie-data-content">
  ${item.content}
  <p>Rated ${item.rating} stars.<p>
  <div class="float-clear"></div>
</div>


`.trim();
}

async function getData() {
  const items = await getAll();
  return items.map((item) => {
    const date = new Date(item.watchedDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const filename = path.resolve(
      `source/blog/${year}/${month}/${item.parameterizedFilmTitle}.md`
    );

    return { filename, item };
  });
}

async function main() {
  const data = await getData();

  // find or create a file for each
  for (const { filename, item } of data) {
    const parentDir = path.dirname(filename);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.writeFileSync(filename, getContents(item));
  }
}

main().then(() => {
  console.log("done");
});
