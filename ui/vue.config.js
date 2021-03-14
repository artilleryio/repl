module.exports = {
  devServer: {
    proxy: process.env.VUE_APP_HTTP_BASE_URL,
  },
};
