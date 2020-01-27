/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import classNames from 'classnames';
import { Toggle } from "react-toggle-component";

/* Import styles and resources */
import './FieldBuilder.scss';

/* Import my components */
import Options from './Options';
import Button from 'components/Button';
import API from 'services/API';

// Types of forms available for the form builder.
const typeOptions = [
  { value: 'Multi-select', label: 'Multi-select' },
];

// Max number of options allowed.
const MAX_OPTIONS_ALLOWED = 50;

export default class FieldBuilder extends Component {

  state = {
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
    submitError: null
  }

  handleTypeChange = (selectedOption) => {
    this.setState({ type: selectedOption });
  }

  handleOrderChange = (selectedOption) => {
    this.setState({ order: selectedOption });
  }

  createNewOption = (idx) => {
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

  deleteOption = (idx) => {
    this.setState((state) => {
      // Creates new options array without the option being deleted.
      const options = state.options.filter((item, j) => idx !== j);
      
      return {
        options,
        maxOptions: false // If you ever delete an option, you will inevitably have less than the max amount since you can't go past the max amount.
      }
    });
  }

  updateOption = (value, idx) => {
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

  handleDefaultValue = (defaultValue) => {
    this.setState({
      defaultValue
    });
  }

  resetForm = () => {
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
      savingForm: false,
      submitSuccess: null,
      submitError: null,
    });
  }

  getFormReadyToSave = () => {
    // Returns all the non blank options
    let newOptions = this.eliminateBlankOptions();

    this.setState({
      options: newOptions
    }, () => {
      this.validateAndTrySavingForm();
    });
  }

  // Gets rid of all the blank options (unless there's just one option).
  eliminateBlankOptions = () => {
    const { options } = this.state;
    let newOptions = []; // copy all non blank values to this array

    for (let i = 0; i < options.length; i++ ) {
      let value = options[i].value;
      if ( value !== '') {
          newOptions.push({ value: value });
      }
    }

    if (newOptions.length === 0 ) {
        // Always keep one row
        newOptions.push({ value: '' });
    }

    return newOptions;
  }

  validateAndTrySavingForm = () => {
    const { options, label, defaultValue, maxOptions } = this.state;
    let optionsClone = _.cloneDeep(options); // Need to manipulate options without changing state

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

    if ( label === '') {
        error = 'Label is empty.'
    } else if ( optionsClone[0].value === '' ) {
        error = 'Please enter an option.';
    } else if ( duplicates ) {
        this.setState({
          options: optionsClone
        });
        error = 'Form contains duplicates entries.';
    } else if ( defaultValue !== '' && !(defaultValue in hashTable) ) {
        if ( maxOptions ) {
            error = 'Default value could not be added to the list. Delete an entry.'
        } else {
            optionsClone.push({ value: defaultValue});
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

  postForm = async (options) => {
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

  handleSuccessResponse = (res) => {
    this.setState({
      savingForm: false,
      submitSuccess: res, 
      submitError: null
    });
  }

  handleErrorResponse = (res) => {
    console.log(res)
    this.setState({
      savingForm: false,
      submitSuccess: null, 
      submitError: 'Server error. Could not save.'
    });
  }

  render() {
    const { options, label, order, defaultValue, type, maxOptions, required, savingForm, 
              submitSuccess, submitError } = this.state;
    const maxOptionsClassname = classNames('fieldbuilder__error-max-capacity', { 'fieldbuilder__error-max-capacity-show': maxOptions });

    return (
      <div className='fieldbuilder'>
        <div className='fieldbuilder__title'> 
            <div className='fieldbuilder__title-header'>Field Builder</div>
        </div>

        <div className='fieldbuilder__body'>
          <div className='fieldbuilder__body-header'> 
              <input type='text' placeholder='Label' className='fieldbuilder__body-header-input'
                value={label} onChange={ (evt) => this.setState({ label: evt.target.value }) }/>

              <Select
                className='fieldbuilder__body-header-select'
                classNamePrefix='fieldbuilder__body-header-select'
                value={type}
                onChange={this.handleTypeChange}
                options={typeOptions}
              />
          </div>

          <div className='fieldbuilder__body-options'>
            <Options options={options} defaultValue={defaultValue} order={order} updateOption={this.updateOption} 
              createNewOption={this.createNewOption} deleteOption={this.deleteOption} handleDefaultValue={this.handleDefaultValue} />  

            <div className={maxOptionsClassname}>{`You have reached your max limit of ${MAX_OPTIONS_ALLOWED} options.`}</div>
          </div>

          <div className='fieldbuilder__body-submit'>
            <div className='fieldbuilder__body-submit-required'>
               <div className='fieldbuilder__body-submit-required-text'>Required</div>
              <Toggle
                name="requiredToggle"
                onToggle={evt => this.setState({ required: evt.target.checked })}
                checked={required}
              />
            </div>
            <div className='fieldbuilder__body-submit-buttons'>

              {submitSuccess && <div className='fieldbuilder__body-submit-success'>Successfully saved!</div>}
              {submitError && <div className='fieldbuilder__error-submit'>{submitError}</div>}

              <Button text='Cancel' cb={this.resetForm}/>
              <Button text='Save changes' cb={this.getFormReadyToSave} color='green' loading={savingForm}/>
            </div>
          </div>

        </div>

      </div>

    );
  }
}
