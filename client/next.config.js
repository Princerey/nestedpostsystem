// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://nestedpostsystem.onrender.com/api/:path*', // Backend URL
        },
      ];
    },
  };
  