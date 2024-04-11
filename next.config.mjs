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
                        value: "*",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
