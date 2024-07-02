const config = {
  plugins: {
    tailwindcss: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};

module.exports = config;
