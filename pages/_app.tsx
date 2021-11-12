import { NotificationsProvider } from "@mantine/notifications";
import "destyle.css/destyle.min.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useEffect } from "react";
import { globalStyles } from "stitches.config";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    globalStyles();
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider>
        <NotificationsProvider autoClose={4000}>
          <Component {...pageProps} />
        </NotificationsProvider>
      </SessionProvider>
    </>
  );
};

export default App;
