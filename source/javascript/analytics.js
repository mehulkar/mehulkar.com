import { getCLS, getFCP, getFID, getLCP, getTTFB } from "web-vitals";

const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed() {
  return "connection" in navigator &&
    navigator["connection"] &&
    "effectiveType" in navigator["connection"]
    ? navigator["connection"]["effectiveType"]
    : "";
}

function sendToAnalytics(metric, options) {
  const urlObject = new URL(location.href);
  const page = urlObject.href.replace(urlObject.origin, "");

  const body = {
    dsn: options.analyticsId,
    id: metric.id, // v2-1653884975443-1839479248192
    page, // /blog/[slug]
    href: urlObject.href, // https://my-app.vercel.app/blog/my-test
    event_name: metric.name, // TTFB
    value: metric.value.toString(), // 60.20000000298023
    speed: getConnectionSpeed(), // 4g
  };

  if (options.debug) {
    console.log("[Analytics]", metric.name, JSON.stringify(body, null, 2));
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: "application/x-www-form-urlencoded",
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: "POST",
      credentials: "omit",
      keepalive: true,
    });
}

window.webVitals = function (analyticsId) {
  if (!analyticsId) {
    console.log("analyticsId not found, skipping analytics. oopes");
    return;
  }
  const options = {
    analyticsId,
    params: {},
  };

  try {
    getFID((metric) => sendToAnalytics(metric, options));
    getTTFB((metric) => sendToAnalytics(metric, options));
    getLCP((metric) => sendToAnalytics(metric, options));
    getCLS((metric) => sendToAnalytics(metric, options));
    getFCP((metric) => sendToAnalytics(metric, options));
  } catch (err) {
    console.error("[Analytics]", err);
  }
};
