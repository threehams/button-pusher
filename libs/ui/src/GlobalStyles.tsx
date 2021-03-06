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
            background-color: #060606;
            min-height: 100vh;
          }

          button {
            border: 0;
            background: none;
          }

          body,
          input,
          button,
          pre {
            margin: 0;
            font-family: "IBM Plex Mono", monospace;
          }

          button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          body,
          button,
          input {
            word-break: break-all;
            color: #f8f8f8;
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
            margin-bottom: 0;
          }

          p {
            margin-top: 0;
            margin-bottom: 0;
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
