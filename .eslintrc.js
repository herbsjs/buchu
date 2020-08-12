module.exports = {
	'env': {
		'commonjs': true,
		'node': true,
		'es6': false
	},
	'extends': [
		'eslint:recommended',
		'prettier'
	],
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parser': 'babel-eslint',
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'func-names': 0,
		'no-param-reassign': 0,
		'no-multi-str': 0,
		'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		'no-console': ['error', { 'allow': ['tron'] }],
		'consistent-return': 0
	}
}
