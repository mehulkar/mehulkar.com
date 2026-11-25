/**
 * <tweet-card> progressively enhances the server-rendered tweet markup
 * (see lib/tweets.js). Without JS it's still a complete, linked card.
 *
 * Enhancements:
 *  - the whole card opens the post on X (click or Enter), unless you clicked
 *    a link/button inside it or were selecting text
 *  - relative date ("2 years ago") with the full date on hover
 *  - a copy-link button with feedback
 *  - a little "pop" on the like button before opening X's like intent
 */
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function timeAgo(date) {
  const seconds = (date - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size)
      return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

class TweetCard extends HTMLElement {
  connectedCallback() {
    if (this.enhanced) return;
    this.enhanced = true;

    const url = this.dataset.url;
    const quote = this.querySelector("blockquote");
    if (!url || !quote) return;

    this.classList.add("is-interactive");
    quote.tabIndex = 0;
    quote.setAttribute("role", "link");
    quote.setAttribute("aria-label", "Open post on X");

    const open = () => window.open(url, "_blank", "noopener");

    quote.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      if (String(window.getSelection())) return; // let people select text
      open();
    });
    quote.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target === quote) open();
    });

    const time = this.querySelector("time[datetime]");
    if (time) {
      const date = new Date(time.dateTime);
      time.title = date.toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "short",
      });
      time.textContent = timeAgo(date);
    }

    const copy = this.querySelector(".tweet-card__copy");
    if (copy && navigator.clipboard) {
      copy.hidden = false;
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(url);
          copy.dataset.state = "copied";
          copy.title = "Copied!";
        } catch {
          copy.dataset.state = "error";
        }
        setTimeout(() => {
          delete copy.dataset.state;
          copy.title = "Copy link";
        }, 1500);
      });
    }

    const like = this.querySelector(".tweet-card__like");
    like?.addEventListener("click", () => {
      like.classList.remove("is-popping");
      void like.offsetWidth; // restart the animation
      like.classList.add("is-popping");
    });

    // External links in the card open in a new tab
    for (const a of this.querySelectorAll("a[href^='http']")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
  }
}

if (!customElements.get("tweet-card"))
  customElements.define("tweet-card", TweetCard);
