module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "simple-import-sort"],
  rules: {
    "lines-between-class-members": [
      "error",
      "always",
      {exceptAfterSingleLine: true},
    ],
    "react/jsx-no-bind": ["error", {allowFunctions: true}],
    "react/jsx-props-no-spreading": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
