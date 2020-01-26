/* Import 3rd party libraries */
import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

/* Import styles and resources*/
import './Question.scss';
import Trash from './img/bin.png';

/* Import my components */
import Checkboxes from 'components/FormBuilder/Checkboxes';


const options = [
  { value: 'Multi-select', label: 'Multi-select' },
  { value: 'Mutiple choice', label: 'Multiple choice' }
];

class Question extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.deleteOption = this.deleteOption.bind(this);

    this.state = {
      label: '',
      type: {value: "Multi-select", label: "Multi-select"},
      options: [''],
      maxOptions: false,
    }
  }

  handleChange(selectedOption) {
    console.log(selectedOption);
    this.setState({ type: selectedOption });
  }

  createNewOption(idx) {
    const { options } = this.state;
    console.log(options.length)

    if ( idx + 1 === options.length && options.length < 50) {
        console.log('last one')
        this.setState({
          options: [...options, '']
        })
    } else if ( idx + 1 === options.length && options.length === 50) {
        this.setState({
          maxOptions: true
        }, () => {
          setTimeout( () => {
            this.setState({ maxOptions: false });
          }, 2000);
        });
    }

  }

  deleteOption(idx) {
    this.setState((state) => {
      const options = state.options.filter((item, j) => idx !== j);
      
      return {
        options
      }
    });
  }

  updateOption(value, idx) {
    this.setState((state) => {
      const options = state.options.map((item, j) => {
        if ( j === idx ) {
            return value;
        } else {
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

    let showDelete = false; 

    if (options.length > 1) {
        showDelete = true;
    }

    return (
      _.map(options, (option, idx) => (
          <div className='question__body-options-row' key={`option-${idx}`}>
            <div className='question__body-options-row-checkbox'></div>
            <input className='question__body-options-row-input' placeholder='Add option' onChange={ (evt) => { this.updateOption(evt.target.value, idx) } }
              value={options[idx]} onFocus={ () => this.createNewOption(idx) }/>
            {showDelete && <img alt='delete' src={Trash} className='question__body-options-row-delete' onClick={ () => this.deleteOption(idx) }/>}
          </div>
        )
      )
    );
  }

  render() {
    const { label, type, maxOptions } = this.state;

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
                onChange={this.handleChange}
                options={options}
              />
          </div>

          <div className='question__body-options'>
            {this.renderOptions()}  
            {maxOptions && <div className='question__error-max-capacity'> You have reached your limit of 50 options. </div>}
          </div>



        </div>

      </div>

    );
  }
}

export default Question;
