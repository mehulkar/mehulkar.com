const HOST = "https://communal-cattle-31052.upstash.io";
const TOKEN = process.env.KV_REST_API_TOKEN;
const ENV = process.env.VERCEL_ENV;

const BLOG_PAGE = /\/blog\/\d{4}\/\d{2}\/.*/;

// TODO: what is the type of `res` in the function??
// TODO: how do you send a response?
// TODO: are the docs wrong? https://vercel.com/docs/functions/functions-api-reference#function-signature
export default async function handler(req, res) {
  const { referer } = req.headers;

  const { valid, reason } = validateBlogURL(referer);
  if (!valid) {
    res.status(400).json({ error: reason });
    return;
  }

  const key = `${ENV}-${keyForURL(referer)}`;
  const url = `${HOST}/incr/${key}`;

  try {
    const redisResponse = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (redisResponse.ok) {
      const { result: count } = await redisResponse.json();
      return res.status(redisResponse.status).json({
        count,
      });
    }

    return res.status(redisResponse.status).json({
      error: redisResponse.statusText,
    });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
}

function validateBlogURL(url) {
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

function keyForURL(url) {
  const fromPage = new URL(url);
  return fromPage.pathname
    .replace(/^\//, "") // remove leading slash
    .replace(/\/$/, "") // remove trailing slash
    .replaceAll(/\//g, "-"); // replace slashes with hyphens
}
