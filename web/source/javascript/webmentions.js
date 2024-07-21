const HOST = "https://webmention.io/api";

function getAllVersionsOfURL(pageURL) {
  const fullURL = `https://www.mehulkar.com${pageURL}`;

  const original = new URL(fullURL);
  const copyForTrailingSlash = new URL(fullURL);

  const all = [original.toString()];

  // Add with and without trailing slash
  if (original.pathname.endsWith("/")) {
    copyForTrailingSlash.pathname = copyForTrailingSlash.pathname.replace(
      /\/$/,
      ""
    );
    all.push(copyForTrailingSlash.toString());
  } else {
    copyForTrailingSlash.pathname = copyForTrailingSlash.pathname + "/";
    all.push(copyForTrailingSlash.toString());
  }

  // TODO: handle arbitrary query params?

  return all;
}

window.fetchWebMentions = function (pageURL) {
  if (!pageURL) {
    return;
  }

  const postUrls = getAllVersionsOfURL(pageURL);

  const targetSearchParams = new URLSearchParams();
  for (const url of postUrls) {
    targetSearchParams.append("target[]", url);
  }

  const countEndpoint = new URL(`${HOST}`);
  countEndpoint.pathname = "/api/count";
  for (const [key, val] of targetSearchParams.entries()) {
    countEndpoint.searchParams.append(key, val);
  }
  const countURL = countEndpoint.toString();

  const mentionEndpoint = new URL(HOST);
  mentionEndpoint.pathname = "/api/mentions.jf2";
  for (const [key, val] of targetSearchParams.entries()) {
    mentionEndpoint.searchParams.append(key, val);
  }
  mentionEndpoint.searchParams.append("sort-by", "published");
  mentionEndpoint.searchParams.append("sort-dir", "up");
  const mentionsURL = mentionEndpoint.toString();

  // count
  fetch(countURL)
    .then((response) => response.json())
    .then((res) => {
      console.log("webmention counts", res);
      if (res.count > 0) {
        document.getElementById("wm-reply-count").innerText =
          `(${res.type.reply})`;

        document.getElementById("wm-like-count").innerText = `${
          res.type.like
        } like${res.type.like.length === 1 ? "" : "s"}`;
      }
    });

  // mentions
  fetch(mentionsURL)
    .then((response) => response.json())
    .then((response) => {
      const byType = new Map();
      response.children.forEach((child) => {
        const type = child["wm-property"];
        if (!byType.has(type)) {
          byType.set(type, []);
        }
        byType.get(type).push(child);
      });

      const fullDate = Intl.DateTimeFormat("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const replies = byType.get("in-reply-to");
      if (replies && replies.length > 0) {
        const section = document.querySelector("#wm-replies");
        const listEl = section.querySelector("ul");
        const template = document.getElementById("wm-reply");

        replies.map((entry) => {
          const ts = new Date(entry.published);
          const clone = template.content.cloneNode(true);
          console.log("entry", entry);
          clone.querySelector("#wm-reply-text").innerHTML = entry.content.html;

          clone
            .querySelector("#wm-reply-author-photo")
            .setAttribute("src", entry.author.photo);
          clone
            .querySelector("#wm-reply-author-photo")
            .setAttribute("alt", `${entry.author.name}`);

          clone.querySelector("#wm-reply-author").innerHTML =
            `<a href="${entry.author.url}">${entry.author.name}</a> said...`;

          clone.querySelector("#wm-reply-date").innerHTML =
            `<time>${fullDate.format(ts)}</time>`;

          clone.querySelector("#wm-reply-link").innerHTML =
            `<a target="_blank" href="${entry.url}">🔗</time>`;

          listEl.appendChild(clone);
        });

        section.classList.toggle("wm-hidden");
      }

      const likes = byType.get("like-of");
      if (likes && likes.length > 0) {
        const section = document.querySelector("#wm-likes");
        const listEl = section.querySelector("ul");

        const template = document.getElementById("wm-like");
        likes.forEach((entry) => {
          const clone = template.content.cloneNode(true);
          clone
            .querySelector("#wm-reply-author-url")
            .setAttribute("href", entry.author.url);
          clone
            .querySelector("#wm-reply-author-url")
            .setAttribute("target", "_blank");

          clone
            .querySelector("#wm-reply-author-photo")
            .setAttribute("src", entry.author.photo);
          clone
            .querySelector("#wm-reply-author-photo")
            .setAttribute("alt", `Liked by ${entry.author.name}`);
          listEl.appendChild(clone);
        });

        section.classList.toggle("wm-hidden");
      }
    });
};
