/** @type {import('next').NextConfig} */
const nextConfig = {
    runtime: "nodejs",
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],

  // ✅ Enable WebAssembly support for tiny-secp256k1
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },

async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: 'https://yieldium.app',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, OPTIONS',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization, x-api-key',  // Add x-api-key here
        },
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
      ],
    },
  ];
}
}