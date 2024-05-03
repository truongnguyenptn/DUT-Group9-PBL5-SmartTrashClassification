import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const configs: Sentry.BrowserOptions = {
  dsn:
    import.meta.env.VITE_NODE_ENV === 'local'
      ? ''
      : import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_NODE_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.1,
};

Sentry.init(configs);
