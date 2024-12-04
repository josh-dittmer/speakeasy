/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '42069',
                pathname: '/api/v1/getFile/*/**',
            },
        ],
    },
};

export default nextConfig;
