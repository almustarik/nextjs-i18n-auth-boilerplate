module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'pnpm exec eslint --fix --quiet',
    'pnpm exec prettier --write',
  ],
  '*.{json,css,md}': ['pnpm exec prettier --write'],
};
