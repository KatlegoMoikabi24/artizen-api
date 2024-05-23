/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],
  env: {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    // Turn off all rules
    "prettier/prettier": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "vue/no-unused-components": "off",
  },
};
