import eslint from '@eslint/js'
import n from 'eslint-plugin-n'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config([
  {
    ignores: ['**/node_modules/**', 'build/**'],
  },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  eslint.configs.recommended,
  n.configs['flat/recommended'],
  // {
  //   languageOptions: { globals: globals.node },

  // },
  {
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ['*.config.*s'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Stylistic concerns that don't interfere with Prettier
      'logical-assignment-operators': [
        'error',
        'always',
        { enforceForIfStatements: true },
      ],
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'operator-assignment': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: { perfectionist: { partitionByComment: true, type: 'natural' } },
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.md/*.ts'],
    rules: {
      'n/no-missing-import': ['error', { allowModules: ['brainbuild-cli'] }],
    },
  },
])
