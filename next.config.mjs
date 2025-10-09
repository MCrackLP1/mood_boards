/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: standalone' - not needed for Vercel
    images: {
        remotePatterns: [],
        dangerouslyAllowSVG: true,
    },
};

export default nextConfig;
