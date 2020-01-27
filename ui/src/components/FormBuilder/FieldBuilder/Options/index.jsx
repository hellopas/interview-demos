/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

/* Import styles and resources */
import './Options.scss';
import Trash from './img/bin.png';

// Types of forms available for the form builder.
const orderOptions = [
  { value: 'A-z', label: '(A-z) - Alphabetical' },
  { value: 'z-A', label: '(z-A) Alphabetical' },
];


export default class Options extends Component {

  constructor(props) {
    super(props);

    // Keeps track of all the focus refs.
    this.fields = {}; 

    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
  }

  handleEnterKeyPress(evt, idx) {
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
                options={orderOptions}
              />
        </div>
      </div>
    );
  }
}
