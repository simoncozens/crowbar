module.exports = {
  output: 'export',
  distDir: 'build',
  basePath: '/crowbar',
  webpack: (config, options) => {
    config.resolve.fallback = { fs: false, path: false, os: false };
    return config;
  },
};
