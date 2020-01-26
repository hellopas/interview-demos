/* Import 3rd party libraries */
import React, { Component } from 'react';

/* Import styles */
import './FormBuilder.scss';

/* Import my components */
import Question from 'components/FormBuilder/Question';

class FormBuilder extends Component {

  constructor(props) {
    super(props);

    this.state = {
        title: 'Untitled form',
        description: '',
        questions: [
        
        ]
    }
  }

  render() {
    const { title, description } = this.state;

    return (
      <div className='formbuilder'>
        
        <div className='formbuilder__title'> 
            <div className='formbuilder__title-header'></div>
            
            <div className='formbuilder__title-input'>
                <input type='text' placeholder='Form title' value={title} onChange={ (evt) => {this.setState({ title: evt.target.value })} }/>
            </div>

            <div className='formbuilder__title-input formbuilder__description-input'>
                <input type='text' placeholder='Form description' value={description} onChange={ (evt) => {this.setState({ description: evt.target.value })} }/>
            </div>
        </div>

        <div className='formbuilder__questions'>
            <Question />
        </div>


      </div>

    );
  }
}

export default FormBuilder;
