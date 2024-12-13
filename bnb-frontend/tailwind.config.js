/** @type {import('tailwindcss').Config} */

const range = (start, end, increment = 1) => {
  const count = Math.floor((end - start + 1) / increment);
  return Array(count)
    .fill(0)
    .map((_, idx) => start + idx * increment);
};

const minSpacingPixel = 0;
const maxSpacingPixel = 2000;
const spacingPixelIncrement = 1;

const minFontSize = 4;
const maxFontSize = 140;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    spacing: {
      ...range(minSpacingPixel, maxSpacingPixel, spacingPixelIncrement).reduce(
        (merged, f) => ({ ...merged, [f]: `${f}px` }),
        {}
      ),
    },

    extend: {
      fontSize: {
        ...range(minFontSize, maxFontSize).reduce(
          (merged, f) => ({ ...merged, [f]: `${f}px` }),
          {}
        ),
      },
      gap: (theme) => theme("spacing"),
      height: (theme) => ({
        ...theme("spacing"),
      }),
      width: (theme) => ({
        ...theme("spacing"),
      }),
      inset: (theme, { negative }) => ({
        ...theme("spacing"),
        ...negative(theme("spacing")),
      }),
      borderRadius: (theme) => ({
        ...theme("spacing"),
      }),
      boxShadow: {
        button: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        "message-container":
          "0px 2px 5px 0px rgba(255, 255, 255, 0.04), 0px 2px 10px 0px rgba(255, 255, 255, 0.10)",
      },
      animation: {
        slidein: "slidein 0.3s",
        "noti-spinner": "rotate 2s linear infinite",
      },
      keyframes: {
        slidein: {
          from: {
            marginRight: "-300px",
          },
          to: {
            marginRight: "0px",
          },
        },
        rotate: {
          from: {
            trasnform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },
  plugins: [],
};
