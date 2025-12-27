module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base/legacy", "prettier"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
