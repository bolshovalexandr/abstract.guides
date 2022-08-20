// создание хранилища
import { createStore, applyMiddleware, compose } from 'redux';
// редьюсеры
import reducer from '../reducers';
// усилители
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// подмена библиотеки compose (объединяет функции-усилители) на аналог с поддержкой DevTools (только в DevMode)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunk, logger)
    )
  );

  // hot module replacement
  if (module.hot) {
    module.hot.accept('../reducers/', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store;
}
