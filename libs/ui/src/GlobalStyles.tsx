import { Global, css } from "@emotion/react";
import React from "react";
import Head from "next/head";

export const GlobalStyles = () => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Global
        styles={css`
          html {
            box-sizing: border-box;
          }
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }

          body {
            margin: 0;
            text-shadow: 0.02956275843481219px 0 1px rgba(0, 30, 255, 0.5),
              -0.02956275843481219px 0 1px rgba(255, 0, 80, 0.3), 0 0 3px;
            background-color: black;
            background-image: radial-gradient(#111, #181818 120%);
            min-height: 100vh;
          }

          body,
          input,
          pre {
            margin: 0;
            font-family: "IBM Plex Mono", monospace;
          }

          body,
          input {
            word-break: break-all;
            color: #43d731;
            font-size: 20px;
          }

          pre {
            font-size: inherit;
          }

          ul {
            margin-top: 0;
            margin-bottom: 0;
            padding-left: 0;
          }

          h1,
          h2,
          h3 {
            font-family: inherit;
            line-height: inherit;
            margin-top: 0;
            font-weight: inherit;
            font-size: inherit;
            margin-bottom: 27px;
          }

          p {
            margin-top: 0;
            margin-bottom: 27px;
          }

          li {
            list-style-type: none;
          }

          a {
            color: #bff3b8;
            text-decoration: none;

            &:hover,
            &:focus,
            &:hover:focus {
              color: black;
              background-color: #bff3b8;
              outline: 0;
              text-shadow: 0.02956275843481219px 0 1px rgba(0, 30, 255, 0.5),
                -0.02956275843481219px 0 1px rgba(255, 0, 80, 0.3), 0 0 2px;
            }
          }

          table {
            border: none;
            border-spacing: 0;
          }

          td,
          th {
            font-weight: inherit;
            text-align: left;
            padding: 0;
            border: none;
            padding-right: 24px;
          }
        `}
      />
    </>
  );
};
