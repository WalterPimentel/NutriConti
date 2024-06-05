module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'prettier/prettier': ['off', {
      endOfLine: 'auto',
    }],
  },
};
