# StyleGuide

## Форматирование с Editorconfig

Конфигурация (.editorconfig)

```
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2

```

## React

### Установка и подключение ESLint
1. Устанавливаем `eslint-plugin-react`, где собраны специфичные для React правила

2. установка ESLint
  1. для `create-react-app`:
  - `eslint` уже установлен и **явная установка с записью в package.json вызовет ошибку при запуске**
  - расширение по умолчанию настройки записаны в `package.json`
  ```
  "eslintConfig": {
    "extends": "react-app"
  }
  ```
- для единообразия лучше перенести `extends` из `package.json` в `.eslintrc.json` в корне проекта

  2. для `webpack`
  - `npm i -D eslint`
  - файл конфигурации `.eslintrc.json` создаем в корне проекта

### Линтинг от AirBnB для React-приложения (без линтинга ARIA, jsx-a11y)
1. Установка правил AirBnB
   `npm i -D eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y`

2. Конфигурация (.eslintrc.json)

```
{
	"extends": ["airbnb", "react-app", "plugin:react/recommended"],
	"rules": {
		"react/jsx-a11y": "off",
		"react/jsx-filename-extension": [1, { "extensions": [".js"]}],
		"react/prop-types": 0,
		"no-underscore-dangle": 0,
		"import/imports-first": ["error", "absolute-first"],
		"import/newline-after-import": "error",
		"no-tabs": 2,
		"comma-dangle": 0,
		"no-restricted-globals":"off",
		"no-param-reassign":"off",
		"prefer-destructuring":"off",
		"no-unused-vars": "warn",
		"object-curly-newline": 0,
		"consistent-return":"off",
		"max-len": [1, 125, 2, { "ignoreComments": true, "ignoreStrings": true,  "ignoreUrls": true   }],
		"no-console": ["error", { "allow": ["log", "warn", "error","time","timeEnd"] }],
		"linebreak-style":0,
		"no-shadow":["warn",{ "allow": ["err","params"] }],
		"no-use-before-define": [2, {"functions": false}],
		"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
	},
	"globals": {
		"window": true,
		"document": true,
		"localStorage": true,
		"FormData": true,
		"FileReader": true,
		"Blob": true,
		"navigator": true
	},
	"parser": "babel-eslint"
}
```

### Линтинг от HTML Academy для React-приложения
1. Установка правил
`npm i -DE eslint-config-htmlacademy`

2. Конфигурация (.eslintrc.yml)

**Прим**: строка `extends: ['htmlacademy/es6', 'plugin:react/recommended']` означает, что для js-синтаксиса используется пресет правил `htmlacademy/es6`, а непосредственно для React - рекомендуемые настройки из `eslint-plugin-react`

```
env:
  es6: true
  browser: true
  commonjs: true

extends: ['htmlacademy/es6', 'plugin:react/recommended']

parserOptions:
  ecmaFeatures:
    jsx: true
  ecmaVersion: 6
  sourceType: module

plugins: ['react']

settings:
  react:
    version: '16'
```

## NUXT + TS (включая Vue-Class-Components)
1. Ставим пакеты
`npm i --save-dev @nuxtjs/eslint-config-typescript @typescript-eslint/eslint-plugin eslint eslint-loader eslint-plugin-nuxt eslint-plugin-prettier eslint-plugin-vue`

2. настраиваем `.eslintrc.js`
```js
module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
		jquery: true
	},
	parserOptions: {
		ecmaFeatures: { legacyDecorators: true },
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended',
		// по Prettier требуются дополнительные изыскания в части файла с переопределнием настроек
		// 'prettier',
		// 'prettier/vue',
		// 'plugin:prettier/recommended',
	],
	// required to lint *.vue files
	plugins: [
		"vue",
		// "prettier",
	],
	// переопределение правил для ESLint
	rules: {
		semi: [1, "always"],
		"no-console": "off",
		"vue/max-attributes-per-line": "off",
		"no-tabs": "off",
		// "indent": ["error", "tab"]
		// "prettier/prettier": ["error", { semi: false }],
	},
};
```
3. Настраиваем `nuxt.config.js`

```js
buildModules: [
	'@nuxt/typescript-build'
],
build: {
	extend (config, ctx) {
		if (ctx.isDev && ctx.isClient) {
			config.devtool = 'eval-source-map';
			config.module.rules.push({
				enforce: "pre",
				test: /\.(js|vue)$/,
				loader: "eslint-loader",
				exclude: /(node_modules)/
			});
		}
	}
},

```

4. Выполняем автофикс, напр.:
`eslint --fix . --ext .js,.vue src`

## StyleLint
- установка
`npm i -DE stylelint stylelint-config-standard stylelint-order stylelint-scss`

- порядок CSS-свойств

- stylelint.config.js
```js
module.exports = {
	extends: [
		'stylelint-config-standard'
	],
	plugins: [
		'stylelint-scss',
		'stylelint-order'
	],
	rules: {
		indentation: 'tab',
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		'order/order': [
			[
				'dollar-variables',
				'custom-properties',
				'at-rules',
				'declarations',
				{
					type: 'at-rule',
					name: 'supports'
				},
				{
					type: 'at-rule',
					name: 'media'
				},
				'rules'
			],
			{ severity: 'warning' }
		],
		'order/properties-order': [ /*сюда можно добавить правил, например, из https://github.com/hudochenkov/stylelint-order*/ ]
	}
};

- автофикс `npx stylelint --fix "**/*.css"`

```
- в nuxt.config.js (без этого падает сборка, свойство из оф.документации не работает)
```js
	stylelint: {
		emitWarning: true
	},
```