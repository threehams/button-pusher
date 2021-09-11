const warnOnLocal = process.env.LINT_ERRORS ? "error" : "warn";

module.exports = {
  extends: ["plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    project: ["./tsconfig.json", "./apps/frontend-e2e/tsconfig.json"],
    ecmaFeatures: {
      modules: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "object-shorthand": [warnOnLocal, "always"],
    "no-console": warnOnLocal,
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unused-expressions": [
      warnOnLocal,
      { allowShortCircuit: true, allowTernary: true },
    ],
    "@typescript-eslint/no-unused-vars": warnOnLocal,
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "mocha/no-exclusive-tests": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "padding-line-between-statements": [
      warnOnLocal,
      {
        blankLine: "always",
        prev: "import",
        next: "*",
      },
      {
        blankLine: "never",
        prev: "import",
        next: "import",
      },
    ],
    "no-fallthrough": "error",
    "react-hooks/exhaustive-deps": [
      "error",
      { enableDangerousAutofixThisMayCauseInfiniteLoops: true },
    ],
    "react-hooks/rules-of-hooks": "error",
    "react/display-name": "off",
    "react/jsx-key": "error",
    "react/jsx-boolean-value": ["error", "never"],
    "react/no-unknown-property": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
  },
  plugins: ["@typescript-eslint", "jsx-a11y", "mocha", "react-hooks", "react"],
};
