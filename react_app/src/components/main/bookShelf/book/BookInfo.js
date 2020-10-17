import React, { Component } from 'react';
import './bookStyle.css';

class BookInfo extends Component {
    render() {
        const textColor = '#607D8B';
        return (
            <div className='BookInfo'>
                <h1>Book Title</h1>   {/* replace with props */}
                <p className='Author'>
                    by: Book Author {/* replace with props */}
                </p>
                <p className='BookPrice'>
                    $5.99 {/* replace with props */}
                </p>

                {/* Add Rate */}
                {/* Add Book Description */}
            </div>
        )
    }
}

export default BookInfo;