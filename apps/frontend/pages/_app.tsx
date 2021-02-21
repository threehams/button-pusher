import { GlobalStyles } from "@botnet/ui";
import { ThemeProvider } from "@emotion/react";
import { setAutoFreeze, enableMapSet, enablePatches } from "immer";
import { AppProps } from "next/app";
import React from "react";
import "../polyfills";

setAutoFreeze(false);
enableMapSet();
enablePatches();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <GlobalStyles />
      <ThemeProvider
        theme={{
          tileWidth: 12,
          tileHeight: 27,
          spaceX: [...Array(12).keys()].map((num) => num * 12),
          spaceY: [...Array(12).keys()].map((num) => num * 26),
        }}
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default MyApp;
