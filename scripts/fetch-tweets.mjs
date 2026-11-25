#!/usr/bin/env node
/**
 * Fetches data for every tweet referenced in blog posts and caches it in
 * source/_data/tweets.json. The build only reads that file and never calls
 * X, so deploys don't depend on X being reachable.
 *
 * Usage (from web/):  node scripts/fetch-tweets.mjs [--force]
 *
 * Uses the public syndication endpoint that powers X's own embeds
 * (same approach as react-tweet).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BLOG_DIR = path.join(ROOT, "source/blog");
const CACHE = path.join(ROOT, "source/_data/tweets.json");
const TWEET_URL =
  /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/\w+\/status(?:es)?\/(\d+)/g;

const force = process.argv.includes("--force");
const cache = fs.existsSync(CACHE)
  ? JSON.parse(fs.readFileSync(CACHE, "utf8"))
  : {};

function findIds(dir) {
  const ids = new Set();
  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
    recursive: true,
  })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const text = fs.readFileSync(
      path.join(entry.parentPath, entry.name),
      "utf8",
    );
    for (const [, id] of text.matchAll(TWEET_URL)) ids.add(id);
  }
  return [...ids];
}

// Token algorithm used by react-tweet for the syndication endpoint
function token(id) {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Turn tweet text + entities into safe HTML with links. */
function textToHtml(tweet) {
  const chars = Array.from(tweet.text); // entity indices are code points
  const [start, end] = tweet.display_text_range || [0, chars.length];
  const e = tweet.entities || {};
  const spans = [
    ...(e.urls || []).map((u) => ({
      i: u.indices,
      html: `<a href="${escape(u.expanded_url)}">${escape(u.display_url)}</a>`,
    })),
    ...(e.user_mentions || []).map((m) => ({
      i: m.indices,
      html: `<a href="https://x.com/${m.screen_name}">@${m.screen_name}</a>`,
    })),
    ...(e.hashtags || []).map((h) => ({
      i: h.indices,
      html: `<a href="https://x.com/hashtag/${encodeURIComponent(h.text)}">#${escape(h.text)}</a>`,
    })),
    // media links are shown as images instead, so drop the t.co text
    ...(e.media || []).map((m) => ({ i: m.indices, html: "" })),
  ]
    .filter((s) => s.i[0] >= start && s.i[1] <= end)
    .sort((a, b) => a.i[0] - b.i[0]);

  let html = "";
  let pos = start;
  for (const s of spans) {
    html += escape(chars.slice(pos, s.i[0]).join(""));
    html += s.html;
    pos = s.i[1];
  }
  html += escape(chars.slice(pos, end).join(""));
  // Tweet text arrives with HTML entities already encoded (e.g. &amp;)
  html = html.replace(/&amp;(amp|lt|gt|quot|#39);/g, "&$1;");
  return html.trim().replace(/\n/g, "<br>");
}

async function fetchTweet(id) {
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${token(id)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (!text) throw new Error("empty response (tweet deleted or protected?)");
  const t = JSON.parse(text);
  if (t.__typename && t.__typename !== "Tweet") throw new Error(t.__typename);
  return {
    id,
    url: `https://x.com/${t.user.screen_name}/status/${id}`,
    name: t.user.name,
    handle: t.user.screen_name,
    avatar: t.user.profile_image_url_https,
    date: t.created_at,
    html: textToHtml(t),
    likes: t.favorite_count ?? null,
    replies: t.conversation_count ?? null,
    replyTo: t.in_reply_to_screen_name ?? null,
    photos: (t.photos || []).map((p) => ({
      url: p.url,
      width: p.width,
      height: p.height,
    })),
  };
}

const ids = findIds(BLOG_DIR);
let fetched = 0;
for (const id of ids) {
  if (cache[id] && !force) continue;
  try {
    cache[id] = await fetchTweet(id);
    fetched++;
    console.log(`✓ ${id} @${cache[id].handle}`);
  } catch (e) {
    console.warn(
      `✗ ${id}: ${e.message} (will fall back to the post's own markup)`,
    );
  }
}

const sorted = Object.fromEntries(
  Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)),
);
fs.writeFileSync(CACHE, JSON.stringify(sorted, null, 2) + "\n");
console.log(
  `${ids.length} tweets referenced, ${fetched} fetched, cache: ${path.relative(ROOT, CACHE)}`,
);
