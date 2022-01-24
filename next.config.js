module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/planning",
        permanent: false,
      },
    ];
  },
};
