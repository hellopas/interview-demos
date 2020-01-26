/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import classNames from 'classnames';

/* Import styles and resources*/
import './Question.scss';
import Trash from './img/bin.png';

// Types of forms available for the form builder.
const typeOptions = [
  { value: 'Multi-select', label: 'Multi-select' },
];

// Types of forms available for the form builder.
const orderOptions = [
  { value: 'A-z', label: '(A-z) - Alphabetical' },
  { value: 'z-A', label: '(z-A) Alphabetical' },
];

// Max number of options allowed.
const MAX_OPTIONS_ALLOWED = 50;

class Question extends Component {

  constructor(props) {
    super(props);

    // Keeps track of all the focus refs.
    this.fields = {}; 

    // Handles type change
    this.handleTypeChange = this.handleTypeChange.bind(this);

    // Handles order change
    this.handleOrderChange = this.handleOrderChange.bind(this);

    // Renders the options for type: multi-select 
    this.renderOptions = this.renderOptions.bind(this);

    // Removes an existing option
    this.deleteOption = this.deleteOption.bind(this);

    // Handles when Enter is pressed while in an options input
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);

    this.state = {
      label: '',
      type: { value: "Multi-select", label: "Multi-select" }, // Default type of form
      order:  { value: 'A-z', label: '(A-z) - Alphabetical' }, // Default ordering
      options: [{
        value: '',
        dulplicate: false
      }],
      maxOptions: false,
    }
  }

  handleTypeChange(selectedOption) {
    this.setState({ type: selectedOption });
  }

  handleOrderChange(selectedOption) {
    this.setState({ order: selectedOption });
  }

  createNewOption(idx) {
    const { options } = this.state;

    // Check to see if the user is focused on the last options field.
    if ( idx + 1 === options.length ) {
        // Add an option field if MAX_OPTIONS_ALLOWED hasn't exceeded.
        if ( options.length < MAX_OPTIONS_ALLOWED ) {
            this.setState({
              options: [...options, { value: '', dulplicate: false }], 
              maxOptions: false
            });
        } else {
            // Let user know they reached MAX_OPTIONS_ALLOWED
            this.setState({ maxOptions: true });
        }
    }
  }

  deleteOption(idx) {
    this.setState((state) => {
      // Creates new options array without the option being deleted.
      const options = state.options.filter((item, j) => idx !== j);
      
      return {
        options,
        maxOptions: false // If you ever delete an option, you will inevitably have less than the max amount since you can't go past the max amount.
      }
    });
  }

  updateOption(value, idx) {
    this.setState((state) => {
      // Creates new options array with all the old options and the option being updated.
      const options = state.options.map((item, j) => {
        // Option being updated
        if ( j === idx ) {
            return { value: value, dulplicate: false}
        } else { // All other options
            return item;
        }
      });

      return {
        options
      }
    });
  }

  renderOptions() {
    const { options } = this.state;

    // Boolean used to show the delete icon. 
    let showDelete = false; 

    // Only show delete icon if there is more than 1 item because there's a 1 option minimum for it to be a question.
    if (options.length > 1) {
        showDelete = true;
    }

    return (
      <div>
        { _.map(options, (option, idx) => (
          <div className='question__body-options-parent' key={`option-${idx}`}>
            <div className='question__body-options-row'>
              <div className='question__body-options-row-checkbox'></div>
              
              <input className='question__body-options-row-input' placeholder='Add option' onChange={ (evt) => { this.updateOption(evt.target.value, idx) } }
                value={options[idx].value} onFocus={ () => this.createNewOption(idx)} ref={ (ref) => this.fields[idx] = ref } onKeyPress={ (evt) => this.handleEnterKeyPress(evt, idx) }/>
              
              {showDelete && <img alt='delete' src={Trash} className='question__body-options-row-delete' onClick={ () => this.deleteOption(idx) }/>}
            </div>
            <div className='question__error-duplicate'>
              Duplicate entry.
            </div>
          </div>
          )
        ) }
        <div className='question__body-options-footer'>
          <div className='question__body-options-footer-text'>Display Order</div>
            <Select
                className='question__body-options-footer-dropdown'
                classNamePrefix='question__body-options-footer-dropdown'
                value={this.state.order}
                onChange={this.handleOrderChange}
                options={orderOptions}
              />
        </div>
      </div>
    );
  }

  handleEnterKeyPress(evt, idx) {
    // Focus on the next input if available when Enter is pressed
    if (evt.key === 'Enter') {
        if (this.state.options.length > (idx + 1)) {
            this.fields[idx + 1].focus();
        }
    }
  }

  render() {
    const { label, type, maxOptions } = this.state;
    const maxOptionsClassname = classNames('question__error-max-capacity', { 'question__error-max-capacity-show': maxOptions });

    return (
      <div className='question'>
        <div className='question__title'> 
            <div className='question__title-header'>Field Builder</div>
        </div>

        <div className='question__body'>
          <div className='question__body-header'> 
              <input type='text' placeholder='Label' className='question__body-header-input'
                value={label} onChange={ (evt) => this.setState({ label: evt.target.value }) }/>

              <Select
                className='question__body-header-select'
                classNamePrefix='question__body-header-select'
                value={type}
                onChange={this.handleTypeChange}
                options={typeOptions}
              />
          </div>

          <div className='question__body-options'>
            {this.renderOptions()}  
            <div className={maxOptionsClassname}>{`You have reached your max limit of ${MAX_OPTIONS_ALLOWED} options.`}</div>
          </div>

        </div>

      </div>

    );
  }
}

export default Question;
