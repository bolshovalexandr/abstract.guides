# Создание сборки React-приложения с помощью Webpack

## Дерево каталогов проекта


```
./public
  ../css
  ../fonts
  ../img
  ../libs-css
  *.html
./src
.editorconfig
.eslintrc.yml
.stylelintrc
.package.json
```

## Установка Webpack и Babel

1. Установка сборщика, интерфейса CLI и dev-сервера
`npm i -DE webpack webpack-cli webpack-dev-server`

2. Установка пакетов для транспайлинга
`npm i -DE @babel/core @babel/preset-env @babel/preset-react babel-loader`

3. Настройка пресетов в .babelrc
```
{
  "presets": ["@babel/preset-react"]
}
```

4. Конфигурирование Webpack (`webpack.config.js`)

*базовая настройка*
(historyApiFallback установлен для react-router)

```
const path = require(`path`);

module.exports = {
  entry: `./src/index.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devServer: {
    contentBase: path.join(__dirname, `public`),
    compress: false,
    port: 1337,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
        },
      }
    ],
  },
  devtool: `source-map`
};
```

*импорт модулей без указания расширений*
```
  resolve: {
    extensions: [`.js`, `.jsx`]
  }
```

*автоподключение нужных модулей на основании литералов в коде*
В состав webpack входит плагин ProvidePlugin, который по результатам анализа кода сам подключает необходмые плагины (например, для jQuery будет `'$':'jquery'`)
```
const webpack = require(`webpack`);
...
  plugins: [
    new webpack.ProvidePlugin({
      'React': `react`,
      'ReactDOM': `react-dom`,
      'PropTypes': `prop-types`
    })
  ],
```


## Форматирование и проверка

### Форматирование с Editorconfig (.editorconfig)

```
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2

```

### Линтинг с ESLint

1. Установка линтера и специфичных правил для React

  `npm i -DE eslint eslint-plugin-react`

2. Установка правил 

  - htmlacademy
  `npm i -DE eslint-config-htmlacademy`
  - AirBnB
  `npm i -D eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y`


3. Конфигурация линтера

  **Прим**: строка `extends: ['htmlacademy/es6', 'plugin:react/recommended']` (или `"extends": ["airbnb", "react-app", "plugin:react/recommended"]`) означает, что для js-синтаксиса используется пресет правил `htmlacademy/es6` / `airbnb`, а непосредственно для React - рекомендуемые настройки из `eslint-plugin-react` и `react-app`

  - htmlacademy (.eslintrc.yml)

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

  - AirBnB

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
        "object-curly-newline": 0,
        "no-console": ["error", { "allow": ["log", "warn", "error","time","timeEnd"] }],
        "linebreak-style":0,
        "no-shadow":["warn",{ "allow": ["err","params"] }],
        "no-use-before-define": [2, {"functions": false}],
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

**Прим. (исключения при подключенном плагине ProvidePlugin)**
В секции globals надо указать автоподключаемые библиотеки
```
globals:
  propTypes: true
  ReactDOM: true
  React: true
```

## Скрипты в packge.json

- webpack

```
    "build": "webpack --mode development",
    "start": "webpack-dev-server --open"
```

- eslint

```
    "eslint": "eslint src/**/*.js src/**/*.jsx",
    "test": "npm run eslint",
    "fix": "eslint --fix --fix-type layout ./src/**/*.js"
```