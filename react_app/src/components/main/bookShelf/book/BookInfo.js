import React, { Component } from 'react';
import './bookStyle.css';

class BookInfo extends Component {
    render() {
        const textColor = '#607D8B';
        return (
            <div className='BookInfo'>
                {/* <h1>Book Title</h1>   replace with props */}
                <h1>{this.props.title}</h1>
                {/* <h1> TEST </h1> */}
                <p className='Author'>
                    {/* by: Book Author replace with props */}
                    by {this.props.author}
                </p>
                <p className='BookPrice'>
                    {/* $5.99 replace with props */}
                    Price: ${this.props.price}
                </p>

                {/* Add Rate */}
                {/* Add Book Description */}
            </div>
        )
    }
}

export default BookInfo;