/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import classNames from 'classnames';
import { Toggle } from "react-toggle-component";
import styled from "styled-components";

/* Import styles and resources */
import './Question.scss';
import Trash from './img/bin.png';

/* Import my components */
import Button from 'components/Button';
import API from 'services/API';

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

export default class Question extends Component {

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

    // Resets the form
    this.resetForm = this.resetForm.bind(this);

    // Starts the process of saving form
    this.trySavingForm = this.trySavingForm.bind(this);

    this.state = {
      label: '',
      type: { value: "Multi-select", label: "Multi-select" }, // Default type of form
      required: true,
      defaultValue: '',
      order:  { value: 'A-z', label: '(A-z) - Alphabetical' }, // Default ordering
      options: [{
        value: ''
      }],
      maxOptions: false,
      savingForm: false,
      submitSuccess: null,
      submitError: null,
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
              options: [...options, { value: '' }], 
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
            return { value: value }
        } else { // All other options
            return item;
        }
      });

      return {
        options
      }
    });
  }

  resetForm() {
    this.setState({
      label: '',
      type: { value: "Multi-select", label: "Multi-select" },
      required: true,
      defaultValue: '',
      order:  { value: 'A-z', label: '(A-z) - Alphabetical' },
      options: [{
        value: ''
      }],
      maxOptions: false,
      submitSuccess: null,
      submitError: null,
    });
  }

  trySavingForm() {
    const { options, label, defaultValue, maxOptions } = this.state;
    let optionsClone = _.cloneDeep(options);

    let hashTable = {};
    let duplicates = false;
    let error = null;
    let success = null;


    for (let i = 0; i < optionsClone.length; i++) {
      let option = optionsClone[i];
      if ( option.value in hashTable ) {
          duplicates = true;
          option.duplicate = true;
      } else {
          hashTable[option.value] = true;
      }
    }

    if ( duplicates ) {
        this.setState({
          options: optionsClone
        });
        error = 'Form contains duplicates entries.';
    } else if ( label === '') {
        error = 'Label is empty.'
    } else if ( optionsClone[optionsClone.length - 1].value === '' ) {
        // Since the form creates a new row when you focus on the "last" row, 
        // this makes sure to ignore that row if it's empty before sending the data to the server.
        console.log('popping')
        optionsClone.pop();
    } else if ( defaultValue !== '' && !(defaultValue in hashTable) ) {

        if ( maxOptions ) {
            error = 'Default value could not be added to the list. Delete an entry.'
        } else {
            console.log('adding default val')
            optionsClone.push({ value: defaultValue});
            console.log(optionsClone)
        }

    }

    if (error) {
        this.setState({
          submitError: error,
          submitSuccess: success
        });
    } else {
        this.postForm(optionsClone);
    }

  }

  async postForm(options) {
    const { label, type, required, defaultValue, order} = this.state;
    let body = {
      label,
      type,
      required,
      defaultValue, 
      order,
      options
    };

    console.log('POST BODY:', body);

    this.setState({
      submitError: null,
      savingForm: true,
    }, async () => {
        API.post('http://www.mocky.io/v2/566061f21200008e3aabd919', { body }).then( (res) => {
            this.handleSuccessResponse(res);
        }).catch(err => {
            this.handleErrorResponse(err);
        });  
    });
  }

  handleSuccessResponse(res) {
    this.setState({
      savingForm: false,
      submitSuccess: res, 
      submitError: null
    });
  }

  handleErrorResponse(res) {
    console.log(res)
    this.setState({
      savingForm: false,
      submitSuccess: null, 
      submitError: 'Server error. Could not save.'
    });
  }

  renderOptions() {
    const { options, defaultValue } = this.state;

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
            { options[idx].duplicate && <div className='question__error-duplicate'>
              Duplicate entry.
            </div>}
          </div>
          )
        ) }
        <div className='question__body-options-footer'>
          <input type='text' placeholder='Default value' className='question__body-options-footer-default'
            value={defaultValue} onChange={ (evt) => this.setState({ defaultValue: evt.target.value }) }/>
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
    const { label, type, maxOptions, required, savingForm, 
              submitSuccess, submitError } = this.state;
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

          <div className='question__body-submit'>
            <div className='question__body-submit-required'>
               <div className='question__body-submit-required-text'>Required</div>
              <Toggle
                name="requiredToggle"
                onToggle={evt => this.setState({ required: evt.target.checked })}
                checked={required}
              />
            </div>
            <div className='question__body-submit-buttons'>

              {submitSuccess && <div className='question__body-submit-success'>Successfully saved!</div>}
              {submitError && <div className='question__error-submit'>{submitError}</div>}

              <Button text='Cancel' cb={this.resetForm}/>
              <Button text='Save changes' cb={this.trySavingForm} color='green' loading={savingForm}/>
            </div>
          </div>

        </div>

      </div>

    );
  }
}
