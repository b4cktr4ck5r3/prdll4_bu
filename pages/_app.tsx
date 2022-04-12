import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/styles";
import { Font } from "@react-pdf/renderer";
import { globalStyles, theme } from "@stitches";
import "dayjs/locale/fr";
import "destyle.css/destyle.min.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useEffect } from "react";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    globalStyles();
  }, []);

  useEffect(() => {
    Font.register({
      family: "Century Gothic",

      fonts: [
        {
          src: "/fonts/CenturyGothicRegular.ttf",
          fontStyle: "normal",
          fontWeight: "normal",
        },
        {
          src: "/fonts/CenturyGothicRegularItalic.ttf",
          fontStyle: "italic",
          fontWeight: "normal",
        },
        {
          src: "/fonts/CenturyGothicBold.ttf",
          fontStyle: "normal",
          fontWeight: "bold",
        },
        {
          src: "/fonts/CenturyGothicBoldItalic.ttf",
          fontStyle: "italic",
          fontWeight: "bold",
        },
      ],
    });
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
          <ModalsProvider>
            <NotificationsProvider autoClose={4000}>
              <Component {...pageProps} />
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default App;
