import { fetch } from "undici";
import { shuffle } from "./_utils.mjs";

// TODO figure out refresh logic, expires after 30 days
const TOKEN = process.env.FEEDLY_ACCESS_TOKEN;

const API_HOST = "https://cloud.feedly.com";
const API_VERSION = "v3";

// Get single annotation
async function getRecentAnotation() {
  // Use API to get last 20 highlights
  const { entries } = await api(
    `${API_HOST}/${API_VERSION}/annotations/journal`
  );

  const shuffled = shuffle(entries);
  const annotation = shuffled[0];

  // .annotation key seems to have all the data we need
  // There is also an `_annotation` key that seems to be exactly the same, not sure why it exists
  // but we won't use it.
  // Other top level keys are: id, entryId, author, and created.
  // TODO: add `created` key to show how recently I annotated.
  return annotation.annotation;
}

// get entry
async function getEntry(entryId) {
  const entries = await api(
    `${API_HOST}/${API_VERSION}/entries/${encodeURIComponent(entryId)}`
  );
  const [entry] = entries;

  console.log(`${entries.length} entries for ${entryId}`, entries);

  return entry;
}

async function api(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  console.log("Fetching", url);
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(res.statusText);
}

export async function getAnnotation() {
  const annotation = await getRecentAnotation();
  console.log("annotation", annotation);
  const entry = await getEntry(annotation.entryId);

  // Highlighted portion of article or raw comment on the article
  const text = annotation.highlight?.text || annotation.comment;

  const data = {
    text,
    timestamp: new Date(annotation.created).toISOString(),
  };

  // Seeing some cases where there is no text, not sure why that happens
  // but we need to be defensive here.
  if (entry) {
    data.originTitle = entry.title;
    data.originURL = entry.originId;
  }

  return data;
}