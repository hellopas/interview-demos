/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import PropTypes from 'prop-types'; // ES6

/* Import styles and resources */
import './Options.scss';
import Trash from './img/bin.png';

/* Import my components */
import * as Constants from 'constants/index';


export default class Options extends Component {

  /**
   * Stores the refs for each input field. Used to focus on the next input when
   * Enter is pressed.
   */
  fields = {}; 


  /**
   * Handles the pressing of 'Enter' key from an option input field so it
   * goes to the next row.
   *
   * @param {Object}   evt  The keyboard event.
   * @param {Int}      idx  An index in the options array.
   */
  handleEnterKeyPress = (evt, idx) => {
    // Focus on the next input if available when Enter is pressed
    if (evt.key === 'Enter') {
        if (this.props.options.length > (idx + 1)) {
            this.fields[idx + 1].focus();
        }
    }
  }

  render() {
    const { options, defaultValue, order } = this.props;

    // Boolean used to show the delete icon. 
    let showDelete = false; 

    // Only show delete icon if there is more than 1 item because there's a 1 option minimum for it to be a question.
    if (options.length > 1) {
        showDelete = true;
    }

    return (
      <div className='options'>
        { _.map(options, (option, idx) => (
          <div className='options__body-options-parent' key={`option-${idx}`}>
            <div className='options__body-options-row'>
              <div className='options__body-options-row-checkbox'></div>
              
              <input className='options__body-options-row-input' placeholder='Add option' onChange={ (evt) => { this.props.updateOption(evt.target.value, idx) } }
                value={options[idx].value} onFocus={ () => this.props.createNewOption(idx)} ref={ (ref) => this.fields[idx] = ref } onKeyPress={ (evt) => this.handleEnterKeyPress(evt, idx) }/>
              
              {showDelete && <img alt='delete' src={Trash} className='options__body-options-row-delete' onClick={ () => this.props.deleteOption(idx) }/>}
            </div>
            { options[idx].duplicate && <div className='options__error-duplicate'>
              Duplicate entry.
            </div>}
          </div>
          )
        ) }
        <div className='options__body-options-footer'>
          <input type='text' placeholder='Default value' className='options__body-options-footer-default'
            value={defaultValue} onChange={ (evt) => this.props.handleDefaultValue(evt.target.value) }/>
          <div className='options__body-options-footer-text'>Display Order</div>
            <Select
                className='options__body-options-footer-dropdown'
                classNamePrefix='options__body-options-footer-dropdown'
                value={order}
                onChange={this.props.handleOrderChange}
                options={Constants.ORDER_OPTIONS}
              />
        </div>
      </div>
    );
  }
}


Options.propTypes = {
  options: PropTypes.array.isRequired,
  defaultValue: PropTypes.string.isRequired,
  order: PropTypes.object.isRequired,
  updateOption: PropTypes.func.isRequired,
  createNewOption: PropTypes.func.isRequired,
  deleteOption: PropTypes.func.isRequired,
  handleDefaultValue: PropTypes.func.isRequired
};
