import posthog from 'posthog-js'

if (process.env.NODE_ENV === 'production' && process.env.POSTHOG_API_KEY) {
  posthog.init(process.env.POSTHOG_API_KEY,
    {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'always'
    }
  )
}