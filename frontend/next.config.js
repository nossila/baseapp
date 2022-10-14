const relay = require('./relay.config');

module.exports = {
  compiler: {
    relay,
  },
  pageExtensions: ['page.mdx', 'page.md', 'page.jsx', 'page.js', 'page.tsx', 'page.ts'],
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Ensures no server modules are included on the client.
      config.plugins.push(new webpack.IgnorePlugin({
        resourceRegExp: /lib\/server/
      }));
    }

    return config;
  },
};
