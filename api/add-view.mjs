/**
 * Page view counter for blog posts.
 *
 * Called by post pages (see source/_includes/post.njk). Increments a counter
 * in Upstash Redis keyed by environment + post path, and returns the new count.
 *
 * Env vars (set by the Upstash integration on Vercel):
 *   KV_REST_API_URL, KV_REST_API_TOKEN
 */

const BLOG_PAGE = /^\/blog\/\d{4}\/\d{2}\/.+/;

export async function GET(request) {
  const referer = request.headers.get("referer");
  const path = blogPathFrom(referer);
  if (!path) {
    return Response.json({ error: "not a blog page" }, { status: 400 });
  }

  const { KV_REST_API_URL, KV_REST_API_TOKEN, VERCEL_ENV } = process.env;
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    return Response.json(
      { error: "view counter not configured" },
      { status: 503 },
    );
  }

  const key = `${VERCEL_ENV}-${keyForPath(path)}`;
  try {
    const res = await fetch(
      `${KV_REST_API_URL}/incr/${encodeURIComponent(key)}`,
      {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
        signal: AbortSignal.timeout(3000),
      },
    );
    if (!res.ok) {
      return Response.json({ error: res.statusText }, { status: 502 });
    }
    const { result: count } = await res.json();
    return Response.json(
      { count },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 502 });
  }
}

/** Returns the post path from the Referer header, or null if it isn't a post. */
function blogPathFrom(referer) {
  if (!referer || !URL.canParse(referer)) return null;
  const { pathname } = new URL(referer);
  return BLOG_PAGE.test(pathname) ? pathname : null;
}

/** "/blog/2024/05/merge-and-rebase/" -> "blog-2024-05-merge-and-rebase" */
function keyForPath(path) {
  return path.replace(/^\//, "").replace(/\/$/, "").replaceAll("/", "-");
}
