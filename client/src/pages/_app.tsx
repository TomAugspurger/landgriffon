import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OverlayProvider } from '@react-aria/overlays';
import { Hydrate } from 'react-query/hydration';
import { Provider as AuthenticationProvider } from 'next-auth/client';
import store from 'store';

import 'styles/globals.css';

const queryClient = new QueryClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthenticationProvider
          session={pageProps.session}
          options={{
            clientMaxAge: 5 * 60, // Re-fetch session if cache is older than 60 seconds
            keepAlive: 10 * 60, // Send keepAlive message every 10 minutes
          }}
        >
          <OverlayProvider>
            <Component {...pageProps} />
          </OverlayProvider>
        </AuthenticationProvider>
      </Hydrate>
    </QueryClientProvider>
  </ReduxProvider>
);

export default MyApp;
