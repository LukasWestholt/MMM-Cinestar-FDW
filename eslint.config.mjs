import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config({
  ignores: ["**/MMM-Cinestar-FDW.js", "**/node_helper.js", "**/jest.config.js"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    eslintPluginPrettierRecommended, // Last element
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
});
