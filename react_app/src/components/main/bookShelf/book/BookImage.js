import React, { Component } from 'react';
import './bookStyle.css';
import img1 from '../../../../assets/16.jpg'

class BookImage extends Component {
    render() {
        return (
            <div className='BookImage'>
                {/* <img src={require('../booksImgs/' + this.props.img)} /> */}
                <img src={img1} ></img>
            </div>
        );
    }
}
export default BookImage;