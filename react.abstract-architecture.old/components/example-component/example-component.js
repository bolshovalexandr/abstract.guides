// минимально необходимые классы React и prop-types
import React from 'react';
import PropTypes from 'prop-types';

// простые вспомогательные утилиты
import _isEmpty from 'lodash/isEmpty';

// вспомогательные компоненты
import Button from '../button';

const propTypes = {
  mix: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
  }).isRequired
};

const defaultProps = {
  mix: ''
}

const ExampleComponent = (props) => {
  const { title, image } = props;

  return (
    <div className="example-component">
        
      <div
        className="example-component__bgimage"
        style={{ backgroundImage: `url(${image.src})` }}
        title={ image.alt || title }
      >
        <h2 className="example-component__title">
          {title}
        </h2>
        <Button 
            className="mix"
        />
      </div>
     </div>
  );
}

ExampleComponent.propTypes = propTypes;
ExampleComponent.defaultProps = defaultProps;
export default ExampleComponent;