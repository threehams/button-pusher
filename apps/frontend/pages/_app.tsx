import { setAutoFreeze } from "immer";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "../styles/global.css";

setAutoFreeze(false);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </React.StrictMode>
  );
}

export default MyApp;
