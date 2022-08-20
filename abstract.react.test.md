# Тестирование React-приложений

## Теоретический минимум

### Виды кода 
- исследовательский код: используется один раз, чтобы получить быстрое решение
- прототип: программируется быстро, чтобы в боевом режиме проверить решение. Через короткое время устаревает и переписывается как готовый продукт
- готовый продукт: код пишется так, чтобы работать максимально эффективно и решать поставленную перед ним задачу

### Виды тестов
- юнит тесты: проверяют логику в отдельных компонентах кода
- интеграционные тесты: проверяют как взаимодействуют между собой разные части программы
- сквозные тесты (функциональные тесты): проверяют, правильно ли себя ведут компоненты

### Подходы к тестированию
- TDD (BDD): Test (Behavior) Driven Development — написание компонент через создание тестов к ним
- TLD: Test-Last Development — написание тестов на уже существующие компоненты

## Тестирование с Jest (снэпшот-тестирование, интеграционные тесты)

### Настройка Jest (базовая)

- установка
`npm install jest react-test-renderer babel-jest -DE`
- запуск тестов из `package.json`
`"test": "npm run eslint && jest"` 
- добавление пресета `@babel/preset-env` для babel (чтобы код тестов также проходил процедуру транспайлинга)
```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
- в секцию `env` в `eslint` добавляем
`jest: true`

### Тесты Jest
1. тест создается в файле component.test.js
2. шаблон теста
**прим.: эталонная разметка создается при первом запуске jest в каталоге `__snapshots__`, ее можно обновить при падении теста, или принудительно, как `jest -- -u`**
```
// импорты основных библиотек (React, PropTypes, если мы не используем автоподключение)
...
// импорт рендерера и компонента
import renderer from 'react-test-renderer';
import App from "./app";

// тестовые данные
const settings = {
  gameTime: 5,
  errorCount: 3,
};

// описание теста a-la Mocha
it(`App correctly renders`, () => {
    // renderer создает из компонента квази DOM-дерево и сериализирует его
    const testDOM = renderer
        .create(<App
        errorCount={settings.errorCount}
        gameTime={settings.gameTime}
        />)
        .toJSON();
// ожидаем, что созданная разметка эквивалента эталонной
expect(testDOM).toMatchSnapshot();
});

```

## Тестирование с Enzyme (сквозные/функциональные/end-2-end тесты)
**прим.: это не совсем e2e/сквозные тесты, они не "проходят" через все приложение, а тестируют только функции в рамках компонента**

### Тесты Enzyme

- установка
`npm install enzyme enzyme-adapter-react-16 -DE`

### Настройка Enzyme (базовая)
Настройка Enzyme выполняется в тестовом файле

```
// shallow - 
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({adapter: new Adapter()});

it(`Click on button`, () => {
  const clickHandler = jest.fn();
  const welcomeScreen = shallow(<WelcomeScreen
    onClick={clickHandler}
  />);
  const startButton = welcomeScreen.find(`.welcome__button`);
  startButton.simulate(`click`, {preventDefault() {}});
  expect(clickHandler).toHaveBeenCalledTimes(1);
});

```

## Расширенная настройка Jest и Enzyme (для версии сборки с автоимпортом библиотек по литералам)

**? непонятно практическое применение transform и testURL?? в `jest.config.json`**
**? уточнить про автоимпорт shallow/mount**

- конфигурация npm-скрипта `test` в `package.json`
Указываем путь к файлу конфигурации `"test": "npm run eslint && jest --config jest.config.json --no-cache"`

- Указываем путь к файлу настройки теста, `jest.config.json`

```
{
  "setupFiles": [
    "<rootDir>test-setup.js"
  ],
  "transform": {
    "^.+\\.(js|jsx|ts)$": "babel-jest"
  },
  "testURL": "http://localhost/"
}

```
- `test-setup.js`
```
const enzyme = require(`enzyme`);
const Adapter = require(`enzyme-adapter-react-16`);
window.React = require(`react`);
window.PropTypes = require(`prop-types`);

enzyme.configure({adapter: new Adapter()});

```