/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/account", destination: "/?signin=1", permanent: false },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
