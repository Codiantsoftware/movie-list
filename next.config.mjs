import i18nConfig from "./next-i18next.config.js";
const { i18n } = i18nConfig;

const nextConfig = {
  reactStrictMode: true,
  i18n,
};

export default nextConfig;
