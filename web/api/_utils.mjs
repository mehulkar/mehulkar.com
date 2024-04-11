const BLOG_PAGE = /\/blog\/\d{4}\/\d{2}\/.*/;

export function validateBlogURL(url) {
  if (!url) {
    return { valid: false, reason: "no url" };
  }

  if (!URL.canParse(url)) {
    return { valid: false, reason: "invalid URL" };
  }

  if (!BLOG_PAGE.test(url)) {
    return { valid: false, reason: "not a blog page" };
  }

  return { valid: true };
}

export function keyForURL(url) {
  const fromPage = new URL(url);
  return fromPage.pathname
    .replace(/^\//, "") // remove leading slash
    .replace(/\/$/, "") // remove trailing slash
    .replaceAll(/\//g, "-"); // replace slashes with hyphens
}
