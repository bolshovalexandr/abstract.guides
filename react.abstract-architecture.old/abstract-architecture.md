/**
 * @deprecated - актуально ли это, спустя 4 года?..
 */
# Архитектура компонентов приложения

*Абстрактная архитектура React-приложения, включая шаблоны точки входа, контейнеров, компонентов и окружения Redux.*

1. Дерево каталогов
2. Детальное описание контейнера
3. Детальное описание компонента
4. Устройство, создание и подключение нового компонента

## дерево каталогов ./abstract-template
*Дерево каталога src, создаваемого стандатным KIT'ом React'а. Надо иметь в виду, что на одном уровне с ./src расположены каталоги public (html-файл с блоком #root),каталог с production-сборкой, а также node_modules, packege.json и т.д*

React-окружение формируется в файлах в каталоге ./src:
    - index.js (подключает <Provider> redux'a + конфигурация стора и <App>)
    - App.js (подключает <Router> -> <Switch> -> <Route> -> пути и компоненты, отдельно <Helmet> и компоненты, присутствующие на каждой странице)

React-компоненты распределены по трем большим группам в каталогах:
    - **view**, где хранятся компоненты главной страницы, которым идут роуты от React router
    - **containers**, где расположены умные компоненты (контейнеры)
    - **components**, где расположены "глупые компоненты"

Redux-окружение расположено в каталогах:
    - store/configureStore.js (создание и настройка хранилища)
	  - constants/actionTypes.js (имена экшнов и редьюсеров)
    - actions
    - reducers
    - index.js (подключение Provider'a Redux'a и передача ему хранилища store)

```
./actions
	.index.js
./containers
    ../example-container
        .example-container.js
        .index.js
./components
    ../example-container
        .example-component.js
        .index.js
        ./__image/
            .example-component__image.scss
        ./__title/
            .example-component__title.scss
./views
    ../example-main-page
    ../example-result-page

```


## Детальное описание Redux

### Библиотеки:
- основные библиотеки: `react-redux` (`Provider`), `redux` (`createStore`, `applyMiddleware`, `compose`)
- вспомогательные: `redux-logger`, `redux-thunk`

### необходимый минимум для использования Redux:

**Создание хранилища**
- `store` создается в `configureStore`, это функция, которая принимает на вход:
  - редьюсер
  - initialState, создает и возвращает store
- `configureStore` во время создания store передает библиотеке createStore начальное состояние, редьюсеры и усилители
- также в `configureStore` создается поддержка Redux DevTools для режима разработчика

**константы**
- редьюсеры и экшены используют один и тот же набор имен для, соответственно, установки и извлечения данных в хранилище - `constants/actionTypes.js`

**редьюсеры**

**экшены**

**Создание хранилища**
- импортируем `index.js` оборачиваем главный компонент App в Provider, которому аргументом передаем `store`


## Детальное описание контейнера

### характеристики контейнера
- обычно не работает с отображением (т.е. не импортирует стили)
- stateful-компонент, наследуется от класса Component
- подключен к Redux
- определяет логику (обработчики, маппинг данных), которую затем передает в компоненты. Связывание передаваемых обработчиков со стейтом контейнера обычно выполняется в конструкторе
- в каталоге с контейнером обычно лежат:
    - файл index, который выгружает и экспортирует контейнер
    - собственно js/jsx-файл с кодом контейнера

### шаблон контейнера

#### код индекса
`./example-container/index.js`

#### код контейнера
Полностью шаблон лежит в `./containers/example-container/example-container.js`

```
// Импорты библиотек для stateful-компонента, работы с Redux,
// Импорты компонентов
// Управление props'ами
const propTypes = {}
const defaultProps = {}

class ExampleContainer extends Component {

    // в конструкторе можно выполнить связывание обработчика, который мы передадим в компонент
    constructor(props) {}

    // обработчик для передачи в компонент
    onHandler = (data) => {}

    // можно определить статические методы, которые потом мы сможем вызвать в обработчике, как метод контейнера
    static staticMethod = (incomingData) => {}

    // или внутри render() **?уточнить, какой в этом прок**
    static staticMethodAnother = (incomingData) => {}

    render() {

        const { ... } = this.props;

        return (
            <>
              <ExampleComponent />
            </>
        );
  }

}

// настраиваем свойства
ExampleContainer.propTypes = propTypes;
ExampleContainer.defaultProps = defaultProps;

// маппинг стора Redux'a
function mapStateToProps(state) {}

// маппинг редьюсеров
function mapDispatchToProps(dispatch) {}

// экспорт
export default connect(mapStateToProps, mapDispatchToProps)(ExampleContainer);

```

## Детальное описание компонента

### характеристики компонента
- обычно stateless-компонент
- возвращает разметку с уже назначенными элементам стилями
- логика обычно ограничена тем, какой стиль назначить элементу в зависимости от полученных свойств
- в каталоге с контейнером обычно лежат:
    - файл index, который экспортирует компонент и подключает множество scss-стилей с помощью директивы require
    - собственно js/jsx-файл с кодом контейнера
    - файл с полными стилями **только** для блока `example-component` + с внешними отступами для элементов блока, например `example-component__title`. Сюда же подключаются константы и миксины
    - подкаталоги со стилями и изображениями, причем именование выполняется по БЭМ, так для компонента `example-component` один из каталогов со стилями может называться `__title`, а внутри него лежать файл с полными стилями элемента **без внешних отступов**, например `example-component__title.scss`

### шаблон компонента

#### код индекса
```
// экспорт экспортированного компонента
export { default } from './example-component';
// подключение стилей
require('./...');

```

#### код компонента
```
// минимально необходимые классы React и prop-types
// простые вспомогательные утилиты
// вспомогательные компоненты

// Управление props'ами
const propTypes = {};
const defaultProps = {}

const ExampleComponent = (props) => {
  const { } = props;

  return (
    <div className="example-component">
      ...
    </div>
  );
}

ExampleComponent.propTypes = propTypes;
ExampleComponent.defaultProps = defaultProps;
export default ExampleComponent;

```
#### стили блока
```
// Необходимые импорты
@import 'src/constants/styles/width';

// только стили блока и внешние отступы элемента (hello, БЭМ)
.example-component {}

```
#### стили элементов
```
@import 'src/constants/styles/colors';

.example-component__title {
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
  color: $text-main-color;
}

```
```
@import 'src/constants/styles/colors';

.example-component__image {
    background: $ultra-light-grey center center;
    background-size: cover;
}

```
