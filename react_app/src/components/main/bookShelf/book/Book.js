import React, { Component } from 'react';
import BookImage from './BookImage';
import BookInfo from './BookInfo';
import './bookStyle.css';

class Book extends Component {
    render() {
        return (
            <div className='Book'>
                <BookImage img={this.props.img}></BookImage>
                <BookInfo title={this.props.title} author={this.props.author} price={this.props.price}></BookInfo>
            </div>
        );
    }
}

export default Book;