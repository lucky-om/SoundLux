import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.sony.com" },
      { protocol: "https", hostname: "**.bose.com" },
      { protocol: "https", hostname: "**.apple.com" },
      { protocol: "https", hostname: "**.beatsbydre.com" },
      { protocol: "https", hostname: "**.jbl.com" },
      { protocol: "https", hostname: "**.steelseries.com" },
      { protocol: "https", hostname: "**.audio-technica.com" },
      { protocol: "https", hostname: "**.sennheiser.com" },
      { protocol: "https", hostname: "**.samsung.com" },
      { protocol: "https", hostname: "**.jabra.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "**.pcmag.com" },
      { protocol: "https", hostname: "**.rtings.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.amazon.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
