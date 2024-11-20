/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
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
    /*rewrites: async () => [
        {
            source: '/api/:path*',
            destination: 'http://localhost:42069/api/:path*'
        }
    ]*/
};

export default nextConfig;
