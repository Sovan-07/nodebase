// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c12e41b911b6ecdacf2fc05030a48b59@o4511398102433792.ingest.us.sentry.io/4511398129303552",

  integrations:[
    Sentry.vercelAIIntegration({
      recordInputs:true,
      recordOutputs:true,
    }),
    Sentry.consoleLoggingIntegration({levels:["log" , "warn" , "error"]}),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
