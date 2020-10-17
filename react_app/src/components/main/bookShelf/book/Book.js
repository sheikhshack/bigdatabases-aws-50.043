import React, { Component } from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';
import './bookStyle.css';

class Book extends Component {
    // constructor(props) {
    // }
    render() {
        return (
            <div className='Book'>
                <BookImage img={this.props.img}></BookImage>
                <BookInfo></BookInfo>
            </div>
        );
    }
}

export default Book;