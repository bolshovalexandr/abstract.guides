// Импорты для stateful-компонента
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// импорты для работы с Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../actions/';

// импорты компонентов
import ExampleComponent from '../../components/example-component';

// управление props'ами
/*
    Полезная тема с пробросом (возможно с верхнего уровня) дополнительного стиля для компонента (mix)
*/
const propTypes = {
    mix: PropTypes.string,
    prop1: PropTypes.array.isRequired,
    prop2: PropTypes.array.isRequired,
    showExampleComponent: PropTypes.func.isRequired,
    setSelectedToRedux: PropTypes.func.isRequired
}
const defaultProps = {
    mix: ''
}

class ExampleContainer extends Component {

    // в конструкторе можно выполнить связывание обработчика, который мы передадим в компонент
    constructor(props) {
        super(props);
        this.onHandler = this.onSelect.bind(this);
    }

    // обработчик для передачи в компонент
    onHandler = (data) => {
        ExampleContainer.staticMethod(data);
    }

    // можно определить статические методы, которые потом мы сможем вызвать в обработчике, как метод контейнера
    static staticMethod = (incomingData) => {
        const outgoingData = incomingData.map();
        return outgoingData;
    }

    // или внутри render() **?уточнить, какой в этом прок**
    static staticMethodAnother = (incomingData) => {
        const outgoingData = incomingData.map();
        return outgoingData;
    }

    render() {

        const {
            prop1,
            prop2,
            showExampleComponent,
            setSelectedToRedux
        } = this.props;

        const propData = ExampleContainer.staticMethodAnother(prop1);

        // красивый прием с логическим выражением рисовать/не рисовать
        return (
            <>
                {showExampleComponent && (
                    <ExampleComponent
                        mix={'custom__style'}
                        data={propData}
                        onClick={onHandler}
                        onSelect={setSelectedToRedux}
                    />
                )}            
            </>
        );
  }

}

// настраиваем свойства
ExampleContainer.propTypes = propTypes;
ExampleContainer.defaultProps = defaultProps;

// маппинг стора Redux'a
function mapStateToProps(state) {
  return {
    showExampleComponent: state.showExampleComponent
  }
}

// маппинг редьюсеров
function mapDispatchToProps(dispatch) {
  const bindedActions = bindActionCreators(Actions, dispatch);
  return {
    setSelectedToRedux: bindedActions.setSelectedToRedux,
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExampleContainer);