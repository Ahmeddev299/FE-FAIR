import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|jsx|tsx)$/] }, 
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
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
