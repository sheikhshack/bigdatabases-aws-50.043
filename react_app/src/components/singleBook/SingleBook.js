import React, { Component } from 'react';
import BookImage from '../main/bookShelf/book/BookImage';
import BookInfo from '../main/bookShelf/book/BookInfo';
import BookDescription from '../main/bookShelf/book/BookDescription';
import sampleBook from '../sample/db.json';  //extracting sample book info from local json file
import './singleBook.css'


class SingleBookReview extends Component {
    render() {
        return (
            <div className='SingleBookReivew'>
                <img className='singleBookImg' src={sampleBook.metadata[0].imUrl} />
                <div className='singleBookInfo'>
                    <h1 className='singleBookTitle'>
                        {sampleBook.metadata[0].title}
                    </h1>
                    {/* <p className='singleBookAsin'>
                        asin no: {sampleBook.metadata[0].asin}
                    </p> */}
                    {/* <p className='singleBookPrice'>
                        Cost: ${sampleBook.metadata[0].price}
                    </p> */}
                    <p className='singleBookDescription'>
                        Book Description: <br></br>{sampleBook.metadata[0].description}
                    </p>
                </div>
                <div className='extraInfo'>
                    <p>
                        <b>Title: {sampleBook.metadata[0].title}
                            <br></br>
                        Author: {sampleBook.metadata[0].author}
                            <br></br>
                        asin no: {sampleBook.metadata[0].asin}
                            <br></br>
                        Cost: ${sampleBook.metadata[0].price}
                            <br></br>
                        Categories:
                            <br></br>
                            <ul>
                                <li key={sampleBook.metadata[0].categories}></li>
                            </ul>
                        </b>
                    </p>
                    {/* <p>
                        Categories: {sampleBook.metadata[0].asin}
                    </p> */}

                </div>
            </div>
        )
    }
}

export default SingleBookReview;