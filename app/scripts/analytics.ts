import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_DEFAULT_API_URL = process.env.POSTHOG_DEFAULT_API_URL || "https://eu.i.posthog.com";
const POSTHOG_API_URL = process.env.POSTHOG_API_URL;

export async function initPostHog() {
  if (process.env.NODE_ENV === 'production' && POSTHOG_KEY) {
    let posthogApiUrl: string | undefined;
    posthogApiUrl = POSTHOG_DEFAULT_API_URL;
    const r = await fetch(POSTHOG_DEFAULT_API_URL, {
      method: "HEAD",
      mode: "no-cors",
    })
    if (!r.ok) {
      console.error("Error fetching PostHog API URL:", r.statusText);
      console.error("Using default PostHog API URL:", POSTHOG_DEFAULT_API_URL);
      posthogApiUrl = POSTHOG_API_URL;
    }
    if (POSTHOG_API_URL) {
      console.log('here');
      posthogApiUrl = POSTHOG_API_URL;
    }
    console.log("Initializing PostHog with API:", posthogApiUrl);
    if (posthogApiUrl) {
      posthog.init(POSTHOG_KEY, {
        api_host: posthogApiUrl,
        ui_host: POSTHOG_DEFAULT_API_URL,
        person_profiles: "always",
      });
    }
  }
}