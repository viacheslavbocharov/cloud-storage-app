module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./backend/auth-service/tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist/', 'node_modules/'],

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
      },
    ],
  },
};
