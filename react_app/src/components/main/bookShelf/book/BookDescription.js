import React, { Component } from 'react';
import './bookStyle.css';

class BookDescription extends Component {
    render() {
        return (
            <div className='BookDescription'>
                {/* <img src={require('../booksImgs/'+this.props.img)}/> */}
                <p>book description</p>
            </div>
        );
    }
}
export default BookDescription;