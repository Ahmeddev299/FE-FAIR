import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  // ⬇️ add this
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|jsx|tsx)$/] }, // only when imported from JS/TS
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            // keep viewBox so 14x14 scales correctly
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                // try to push fills/strokes toward CSS control
                { name: "convertColors", params: { currentColor: true } },
              ],
            },
            // nice-to-haves
            titleProp: true,
            ref: true,
            prettier: false,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
