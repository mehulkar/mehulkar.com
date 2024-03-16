#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync, existsSync } from "fs";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";
import path from "path";

async function main() {
  const rl = readline.createInterface({ input, output });
  const title = await new Promise((resolve) => {
    rl.question("title of post: ", (title) => {
      resolve(title);
      rl.close();
    });
  });

  return title;
}

const title = await main();
const parameterizedTitle = title
  .replaceAll(/[,:]/g, " ") // replace special characters with space
  .replaceAll(/\s+/g, "-") // replace all contiguous spaces with a single hyphen
  .toLowerCase();

const { month, year, fullDate } = getDateSegments();

const filePath = path.resolve(
  `source/blog/${year}/${month}/${parameterizedTitle}.md`
);

console.log(`New post: ${title}`);
console.log(`File name: ${parameterizedTitle}`);
console.log(`File path: ${filePath}`);

const dirname = path.dirname(filePath);

const contents = [
  "---\n",
  `title: ${title}\n`,
  `date: ${fullDate}\n`,
  `tags:\n`,
  "---\n\n",
].join("");

if (!existsSync(dirname)) {
  console.log(`Creating directory ${dirname}`);
  execSync(`mkdir -p ${dirname}`);
}

console.log(`Writing filepath ${filePath}`);
writeFileSync(filePath, contents);

console.log(`Checking out new branch ${parameterizedTitle}`);
execSync(`git checkout -b post/${parameterizedTitle}`);
console.log(`Opening filePath ${filePath} with code editor`);
execSync(`code . -g ${filePath}`);

function getDateSegments() {
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const _month = dateObj.getMonth() + 1;
  const _date = dateObj.getDate();
  const month = _month < 10 ? `0${_month}` : `${_month}`;
  const date = _date < 10 ? `0${_date}` : `${_date}`;
  const fullDate = `${year}-${month}-${date}`;

  return {
    year,
    month,
    fullDate: fullDate,
  };
}
