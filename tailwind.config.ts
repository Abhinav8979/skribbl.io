import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./layout/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        unit: "48px",
      },
      fontSize: {
        base: "14px",
      },
      dropShadow: {
        custom: "3px 3px 0px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        custom: "3px",
      },
      colors: {
        textCanvasTransparent: "#404040",
        panelBg: "rgba(12, 44, 150, 0.75)",
        panelLo: "rgba(7, 36, 131, 0.75)",
        panelHi: "#1640c9",
        panelFocus: "#ee9631",
        panelBorder: "#040a33",
        panelBorderFocus: "#56b2fd",
        panelText: "#f0f0f0",
        panelTextFocus: "#ffffff",
        panelTextPlaceholder: "#9b9b9b",
        panelButton: "#2a51d1",
        panelButtonHover: "#1e44be",
        panelButtonActive: "#1d40b4",
        playButton: "#53E237",
        playButtonHover: "#38C41C",
      },
    },
  },
  plugins: [],
};

export default config;
