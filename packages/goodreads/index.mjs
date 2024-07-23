import { JSDOM } from "jsdom";
import path from "node:path";
import fs from "node:fs";

const knownSkippedCellTypes = [
  "actions",
  "asin",
  "avg_rating",
  "avg_ratings",
  "checkbox",
  "comments",
  "date_pub_edition",
  "date_pub",
  "date_started",
  "format",
  "isbn",
  "isbn13",
  "notes",
  "num_pages",
  "num_ratings",
  "owned",
  "position",
  "read_count",
  "review",
  "shelves",
  "votes",
];

async function fetchHTML() {
  const res = await fetch(
    "https://www.goodreads.com/review/list/27391275?shelf=read"
  );
  if (res.ok) {
    const text = res.text();
    return text;
  }
}

async function getData() {
  const html = await fetchHTML();
  if (!html) {
    return;
  }

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const table = document.getElementById("books").querySelector("tbody");
  const skippedCells = new Set();
  const data = [...table.getElementsByTagName("tr")].map((row) => {
    const tds = row.getElementsByTagName("td");
    const structeredRow = {};
    for (const td of tds) {
      const s = new Set(td.classList);
      s.delete("field");
      const cellType = [...s][0];

      if (cellType === "title") {
        const { thing } = td.textContent.match(
          /(?<name>\w+)\s+(?<thing>.*)/
        ).groups;
        structeredRow.title = thing.trim();
      } else if (cellType === "author") {
        const { thing } = td.textContent.match(
          /(?<name>\w+)\s+(?<thing>.*)/
        ).groups;
        structeredRow.author = thing.trim();
      } else if (cellType === "cover") {
        structeredRow.cover = td.querySelector("img").getAttribute("src");
      } else if (cellType === "rating") {
        structeredRow.stars = td.querySelectorAll(".staticStar.p10").length;
      } else if (cellType === "date_added") {
        const { thing } = td.textContent.match(
          /(?<name>\w+ \w+)\s+(?<thing>.*)/
        ).groups;
        structeredRow.dateAdded = dateParse(thing);
      } else if (cellType === "date_read") {
        const { thing } = td.textContent.match(
          /(?<name>\w+ \w+)\s+(?<thing>.*)/
        ).groups;
        structeredRow.dateRead = dateParse(thing);
      } else {
        if (!knownSkippedCellTypes.includes(cellType)) {
          skippedCells.add(cellType);
        }
      }
    }
    return structeredRow;
  });

  return data;
}

function parameterize(string) {
  return string.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getContents(item, date) {
  return `
---
title: "${item.title}"
date: ${date.year}-${date.month}-${date.date}
tags: books
image: "${item.cover}"
stars: "${item.stars}"
---

<div class="letterboxd-movie-data-content">
    <img src="${item.cover}">
    ${item.title} - ${item.author}
    <p>Rated ${item.stars} stars.<p>
    <div class="float-clear"></div>
    </div>
`.trimStart();
}

async function main() {
  const data = await getData();

  for (const item of data) {
    let date = item.dateRead;
    if (date._debug === "not set") {
      date = item.dateAdded;
    }
    // If we don't have a date, we don't know where to put this post, so move on
    if (date._debug === "not set") {
      continue;
    }

    const { month, year } = date;
    if (Number.isNaN(year)) {
      throw new Error("failed");
    }

    const title = parameterize(item.title);
    const filename = `web/source/blog/${year}/${month}/${title}.md`;
    const parentDir = path.dirname(filename);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.writeFileSync(filename, getContents(item, date));
  }
}

main().then((data) => console.log(data));

// Expcets format 'Nov 20, 2020'
function dateParse(dateStr) {
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const dateParts = dateStr.split(" ");
  const year = String(parseInt(dateParts[2]));
  const month = monthMap[dateParts[0]];
  const date = padDateString(String(parseInt(dateParts[1].replace(",", ""))));

  // Create the date object
  return {
    month: month,
    date: date,
    year: year,
    _debug: dateStr,
  };
}

function padDateString(str) {
  return String(str).padStart(2, "0");
}
