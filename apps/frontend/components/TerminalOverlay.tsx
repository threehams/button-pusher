import React from "react";
import { css } from "@emotion/react";

export const TerminalOverlay = () => {
  return (
    <div
      css={css`
        /* stolen from http://aleclownes.com/2017/02/01/crt-display.html, need to come up with my own */
        position: fixed;
        pointer-events: none;
        height: 100vh;
        width: 100%;
        z-index: 100;

        @keyframes flicker {
          0% {
            opacity: 0.27861;
          }
          5% {
            opacity: 0.34769;
          }
          10% {
            opacity: 0.23604;
          }
          15% {
            opacity: 0.90626;
          }
          20% {
            opacity: 0.18128;
          }
          25% {
            opacity: 0.83891;
          }
          30% {
            opacity: 0.65583;
          }
          35% {
            opacity: 0.67807;
          }
          40% {
            opacity: 0.26559;
          }
          45% {
            opacity: 0.84693;
          }
          50% {
            opacity: 0.96019;
          }
          55% {
            opacity: 0.08594;
          }
          60% {
            opacity: 0.20313;
          }
          65% {
            opacity: 0.71988;
          }
          70% {
            opacity: 0.53455;
          }
          75% {
            opacity: 0.37288;
          }
          80% {
            opacity: 0.71428;
          }
          85% {
            opacity: 0.70419;
          }
          90% {
            opacity: 0.7003;
          }
          95% {
            opacity: 0.36108;
          }
          100% {
            opacity: 0.24387;
          }
        }
        &::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(18, 16, 16, 0.08);
          opacity: 0;
          z-index: 2;
          pointer-events: none;
          animation: flicker 0.15s infinite;
        }
        &::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 25%,
            rgba(0, 0, 0, 0.25) 30%
          );
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
      `}
    />
  );
};
