const tsEslint = require("typescript-eslint");
const tsStylistic = require("@stylistic/eslint-plugin-ts");

module.exports = tsEslint.config({
    files: [
        "**/*.ts",
        "**/*.tsx"
    ],
    languageOptions: {
        parser: tsEslint.parser
    },
    plugins: {
        "@ts": tsEslint.plugin,
        "@ts-styles": tsStylistic
    },
    rules: {
        "@ts/quotes": ["error", "double"],
        "@ts-styles/quote-props": ["error", "as-needed"],
        "@ts-styles/brace-style": "error",
        "@ts-styles/comma-dangle": ["error", "never"],
        "@ts-styles/comma-spacing": "error",
        "@ts-styles/function-call-spacing": "error",
        "@ts-styles/indent": ["error", 4],
        "@ts-styles/key-spacing": "error",
        "@ts-styles/keyword-spacing": "error",
        "@ts-styles/member-delimiter-style": "error",
        "@ts-styles/semi": "error",
        "@ts-styles/no-extra-semi": "error",
        "@ts-styles/type-annotation-spacing": "error",
        "@ts/no-empty-function": "warn",
        "@ts/no-unused-vars": "warn"
    }
});