// import { StrictMode } from 'react';
import { ConfigProvider, getPopupContainer } from '@enouvo/react-uikit';
import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { StyleProvider } from '@ant-design/cssinjs';
import 'tippy.js/dist/tippy.css';
import { StrictMode } from 'react';
import ErrorFallback from './shared/components/common/ErrorFallback';
import App from './App';
import './configs';
import i18n from './shared/i18n';
import { client as apolloClient } from './graphql/client';
import client from './api/client';
import { getConfigLocale } from './shared/utils/tool';
import '#/configs/sentry';
import { BUTTON, IMAGE, TOKEN } from './configs/theme/antd-theme';

function Main() {
  const { i18n: i18nState } = useTranslation();
  return (
    <Sentry.ErrorBoundary
      fallback={({ ...props }) => <ErrorFallback {...props} />}
    >
      <I18nextProvider i18n={i18n}>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={client}>
            <ConfigProvider
              getPopupContainer={getPopupContainer}
              locale={getConfigLocale(i18nState.language)}
              theme={{
                components: {
                  ['Button']: BUTTON,
                  ['Image']: IMAGE,
                },
                token: TOKEN,
              }}
            >
              <StyleProvider hashPriority="high">
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </StyleProvider>
            </ConfigProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </I18nextProvider>
    </Sentry.ErrorBoundary>
  );
}
const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Main />
  </StrictMode>,
);
