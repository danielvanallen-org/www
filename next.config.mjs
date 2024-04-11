/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    headers: async () => {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.NEXT_PUBLIC_APP_URL,
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
