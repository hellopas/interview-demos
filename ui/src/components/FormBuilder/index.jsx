/* Import 3rd party libraries */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";

/* Import styles */
import './FormBuilder.scss';

/* Import my components */
import FieldBuilder from 'components/FormBuilder/FieldBuilder';

export default class FormBuilder extends Component {
  
  state = {
    title: 'Untitled form',
    description: ''
  };

  render() {
    const { title, description } = this.state;

    return (
      <div className='formbuilder'>
        <Helmet>
          <title>{title} - Quick Base</title>
        </Helmet>
        
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
            <FieldBuilder />
        </div>


      </div>

    );
  }
}
