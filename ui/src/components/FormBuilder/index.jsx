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

  /**
   * Checks to see if title and description values are available in local
   * storage. If so, sets state with those values. This is to prevent user from
   * losing data in case of closing browser or accidentally leaving page.
   */
  componentDidMount() {

    let title = localStorage.hasOwnProperty('title') && localStorage.getItem('title') !== ''
              ? localStorage.getItem('title') 
              : 'Untitled form';

    let description = localStorage.hasOwnProperty('description') 
                     ? localStorage.getItem('description') 
                     : '';

    this.setState({
      title,
      description
    });
  }

  /**
   * Handles "label" input field and sets state.
   *
   * @param {String} value.
   */
  handleTitleChange = (value) => {
    this.setState({ title: value });

    localStorage.setItem('title', value);
  }

  /**
   * Handles "description" input field and sets state.
   *
   * @param {String} value.
   */
  handleDescriptionChange = (value) => {
    this.setState({ description: value });

    localStorage.setItem('description', value);
  }

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
            <input type='text' placeholder='Form title' value={title} onChange={ (evt) => this.handleTitleChange(evt.target.value) }/>
          </div>

          <div className='formbuilder__title-input formbuilder__description-input'>
            <input type='text' placeholder='Form description' value={description} onChange={ (evt) => this.handleDescriptionChange(evt.target.value) }/>
          </div>
        </div>

        <div className='formbuilder__questions'>
            <FieldBuilder />
        </div>


      </div>

    );
  }
}
