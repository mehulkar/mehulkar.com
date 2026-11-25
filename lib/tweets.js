/**
 * Renders tweets as <tweet-card> elements at build time.
 *
 * Handles two forms found in posts:
 *  1. A tweet URL alone on its own line (rendered by markdown as <p>URL</p>)
 *  2. X's official embed markup: <blockquote class="twitter-tweet">…</blockquote>
 *     (plus its widgets.js <script>, which is removed)
 *
 * Data comes from source/_data/tweets.json (see scripts/fetch-tweets.mjs).
 * If a tweet isn't cached (or was deleted), we fall back to whatever the post
 * itself contains, so a card always renders and never depends on X at runtime.
 */
import fs from "node:fs";
import path from "node:path";

const CACHE = path.join(import.meta.dirname, "../source/_data/tweets.json");
const STATUS_URL = String.raw`https?://(?:www\.)?(?:twitter|x)\.com/(\w+)/status(?:es)?/(\d+)[^\s<"]*`;

const BARE_TWEET = new RegExp(
  String.raw`<p>\s*(?:<a [^>]*>)?(${STATUS_URL})(?:</a>)?\s*</p>`,
  "g",
);
const EMBED =
  /<blockquote class="twitter-tweet"[^>]*>([\s\S]*?)<\/blockquote>\s*(?:<script[^>]*widgets\.js[^>]*><\/script>)?/g;
const WIDGETS_SCRIPT =
  /<script[^>]*platform\.twitter\.com\/widgets\.js[^>]*><\/script>/g;

const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const escape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE, "utf8"));
  } catch {
    return {};
  }
}

const ICONS = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  reply:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M4 5h16v11H9l-5 4z"/></svg>',
  repost:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M7 4 4 7l3 3M4 7h11a4 4 0 0 1 4 4v1M17 20l3-3-3-3m3 3H9a4 4 0 0 1-4-4v-1"/></svg>',
  like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
};

/** @param {{id, url, name, handle, avatar?, date?, html, likes?, replyTo?, photos?}} t */
export function renderTweetCard(t) {
  const profile = `https://x.com/${t.handle}`;
  const date = t.date ? new Date(t.date) : null;
  const avatar = t.avatar
    ? `<img class="tweet-card__avatar" src="${escape(t.avatar)}" alt="" width="40" height="40" loading="lazy" decoding="async">`
    : `<span class="tweet-card__avatar tweet-card__avatar--initial" aria-hidden="true">${escape((t.name || t.handle).trim()[0] || "?")}</span>`;
  const photos = (t.photos || [])
    .map(
      (p) =>
        `<img src="${escape(p.url)}" alt="" loading="lazy" decoding="async"${p.width ? ` width="${p.width}" height="${p.height}"` : ""}>`,
    )
    .join("");
  const likes =
    typeof t.likes === "number" && t.likes > 0
      ? `<span>${compact.format(t.likes)}</span>`
      : "";

  return `<tweet-card class="tweet-card" data-url="${escape(t.url)}">
<blockquote cite="${escape(t.url)}">
  <header class="tweet-card__header">
    <a class="tweet-card__author" href="${profile}">
      ${avatar}
      <span class="tweet-card__names">
        <strong>${escape(t.name || t.handle)}</strong>
        <span>@${escape(t.handle)}</span>
      </span>
    </a>
    <a class="tweet-card__logo" href="${escape(t.url)}" aria-label="View post on X">${ICONS.x}</a>
  </header>
  ${t.replyTo ? `<p class="tweet-card__reply-to">Replying to <a href="https://x.com/${escape(t.replyTo)}">@${escape(t.replyTo)}</a></p>` : ""}
  <p class="tweet-card__text">${t.html}</p>
  ${photos ? `<div class="tweet-card__photos tweet-card__photos--${Math.min(t.photos.length, 4)}">${photos}</div>` : ""}
  <footer class="tweet-card__footer">
    ${date ? `<a class="tweet-card__date" href="${escape(t.url)}"><time datetime="${date.toISOString()}">${fullDate.format(date)}</time></a>` : ""}
    <span class="tweet-card__actions">
      <a href="https://x.com/intent/tweet?in_reply_to=${t.id}" aria-label="Reply on X" title="Reply">${ICONS.reply}</a>
      <a href="https://x.com/intent/retweet?tweet_id=${t.id}" aria-label="Repost on X" title="Repost">${ICONS.repost}</a>
      <a class="tweet-card__like" href="https://x.com/intent/like?tweet_id=${t.id}" aria-label="Like on X" title="Like">${ICONS.like}${likes}</a>
      <button type="button" class="tweet-card__copy" aria-label="Copy link to post" title="Copy link" hidden>${ICONS.link}</button>
    </span>
  </footer>
</blockquote>
</tweet-card>`;
}

/** Build tweet data from X's embed markup (used when the tweet isn't cached). */
export function parseEmbed(inner) {
  const text = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  const byline = inner.match(
    /&mdash;\s*([\s\S]*?)\s*\(@(\w+)\)\s*<a href="([^"]+)"[^>]*>([^<]*)<\/a>/,
  );
  if (!text || !byline) return null;
  const [, name, handle, href, dateText] = byline;
  const id = (href.match(/status(?:es)?\/(\d+)/) || [])[1];
  if (!id) return null;
  const date = new Date(`${dateText} UTC`);
  return {
    id,
    url: `https://x.com/${handle}/status/${id}`,
    name: name.trim(),
    handle,
    date: isNaN(date) ? null : date.toISOString(),
    html: text[1].replace(/<br\s*\/?>/g, "<br>").trim(),
  };
}

function fallbackForBareUrl(handle, id) {
  const url = `https://x.com/${handle}/status/${id}`;
  return {
    id,
    url,
    name: handle,
    handle,
    html: `<a href="${url}">View this post on X</a>`,
  };
}

export function transformTweets(content) {
  if (!content.includes("twitter.com") && !content.includes("x.com"))
    return content;
  const cache = loadCache();

  let out = content.replace(EMBED, (match, inner) => {
    const parsed = parseEmbed(inner);
    if (!parsed) return match;
    const cached = cache[parsed.id];
    return renderTweetCard(cached ? { ...parsed, ...cached } : parsed);
  });

  out = out.replace(BARE_TWEET, (match, _url, handle, id) =>
    renderTweetCard(cache[id] || fallbackForBareUrl(handle, id)),
  );

  out = out.replace(WIDGETS_SCRIPT, "");

  if (
    out.includes("<tweet-card") &&
    !out.includes("/javascript/tweet-card.js")
  ) {
    out = out.replace(
      "</body>",
      `<script type="module" src="/javascript/tweet-card.js"></script>\n</body>`,
    );
  }
  return out;
}
