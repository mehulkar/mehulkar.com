import { createClient } from "@vercel/kv";

export default async function handler(request, response) {
  const users = createClient({
    url: process.env.USERS_REST_API_URL,
    token: process.env.USERS_REST_API_TOKEN,
  });

  const user = await users.hgetall("user:me");

  const products = createClient({
    url: process.env.PRODUCTS_REST_API_URL,
    token: process.env.PRODUCTS_REST_API_TOKEN,
  });

  const product = await products.hgetall("product:shirt");
  return response.status(200).json({ user, product });
}

import { kv } from "@vercel/kv";

async function exampleCommands() {
  try {
    await kv.set("setExample", "123abc", { ex: 100, nx: true });
  } catch (error) {
    // Handle errors
  }
}
