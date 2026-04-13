export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      '../frontend/js/config.js',
    ],
  },
  {
    files: ['src/**/*.js', 'test/**/*.js', '../frontend/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        IntersectionObserver: 'readonly',
        Intl: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        global: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
];
