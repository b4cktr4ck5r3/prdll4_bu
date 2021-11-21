import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/styles";
import { globalStyles, theme } from "@stitches";
import "destyle.css/destyle.min.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useEffect } from "react";

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
        <title>CPlanner</title>
      </Head>
      <SessionProvider>
        <MantineProvider
          theme={{
            fontFamily: theme.fonts.main.value,
            fontFamilyMonospace: theme.fonts.main.value,
            headings: { fontFamily: theme.fonts.main.value },
          }}
        >
          <NotificationsProvider autoClose={4000}>
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default App;
