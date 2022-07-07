module.exports = function () {
  return {
    VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID || "",
    ELEVENTY_ENV: process.env.ELEVENTY_ENV || "development",
  };
};
