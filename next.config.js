const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withPWA = require('next-pwa')({
  dest:        'public',
  disable:     process.env.NODE_ENV === 'development',
  register:    true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options',         value: 'DENY' },
        { key: 'X-XSS-Protection',        value: '1; mode=block' },
        { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};

module.exports = withNextIntl(withPWA(nextConfig));