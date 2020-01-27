/* Import 3rd party libraries */
import React, { Component } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types'; // ES6

/* Import styles and resources */
import './Button.scss';
import Loading from './img/waiting.png';

export default class Button extends Component {

    render() {
      const { loading, cb, text, color } = this.props;
      const buttonClasses = classNames({ 'button__green': color === 'green' },
                                       { 'button__white': color === 'white' },
                                       { 'button': !loading }, 
                                       { 'button__loading': loading });

      return (
        <div>
          { loading && 
            <div className={buttonClasses}>
              <img alt='loading' src={Loading} className='button__loading-img' />
            </div>
          }
          { !loading &&
            <div className={buttonClasses} onClick={cb}>
              <div className='button__text'>{text}</div>
            </div>
          }
        </div>
      )
    }

}

Button.defaultProps = {
  color: 'white',
  loading: false,
};

Button.propTypes = {
  cb: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};