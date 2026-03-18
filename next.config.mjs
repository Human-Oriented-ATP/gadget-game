/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/public-v0",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
