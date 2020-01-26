/* Import 3rd party libraries */
import React, { Component } from 'react';

/* Import styles */
import './Checkboxes.scss';

/* Import my components */


class Checkboxes extends Component {

  constructor(props) {
    super(props);

    this.state = {
        title: 'Untitled form',
        description: '',
    }
  }

  render() {
    const { title, description } = this.state;

    return (
      <div className='checkboxes'>
        <div className='checkboxes__title'> 
            <div className='checkboxes__title-header'>Field Builder</div>
        </div>

        <div className='checkboxes__body'> 
            
        </div>


      </div>

    );
  }
}

export default Checkboxes;
