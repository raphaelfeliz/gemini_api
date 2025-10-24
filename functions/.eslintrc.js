module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "linebreak-style": "off", //
    // Allow slightly longer lines for generated prompts / example code in functions
    "max-len": ["error", {"code": 120}],
    // Ensure newline at end of file
    "eol-last": ["error", "always"],
  },
  // Disable strict quote checks for config files (they may use single quotes)
  overrides: [
    {
      files: [".eslintrc.js", "*.config.js", "webpack.config.js"],
      rules: {
        "quotes": "off",
      },
    },
  ],
};


