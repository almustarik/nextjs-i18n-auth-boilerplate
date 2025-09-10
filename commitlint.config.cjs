module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Optional: soften rules as you like
  rules: {
    'subject-case': [0], // don’t force subject case
    'scope-case': [0], // don’t force scope case
    'body-max-line-length': [0], // no hard wrap
  },
};
