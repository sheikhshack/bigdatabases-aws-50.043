import React, { Component } from 'react';
import './bookStyle.css';

class BookDescription extends Component {
    render() {
        return (
            <div className='BookDescription'>
                <p>{this.props.description}</p>
                {/* <p> Book Description </p> */}
            </div>
        );
    }
}
export default BookDescription;