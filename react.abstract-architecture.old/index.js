// Библиотеки React
import React from 'react';
import ReactDOM from 'react-dom';
// Библиотеки Redux
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
// Вспомогательные компоненты
import Favicon from 'react-favicon';
import App from './App';
import * as serviceWorker from './serviceWorker';
// Основные стили
import './index.css';

// Создаем стор
const store = configureStore();

// Подключаем React к DOM-дереву
ReactDOM.render(
    // Подключаем хранилище Redux к компоненту Provider
    <Provider store={store}>
    	<Favicon url="./favicon.ico" />
      <App />
    </Provider>,
    document.getElementById('root')
  );

serviceWorker.unregister();
