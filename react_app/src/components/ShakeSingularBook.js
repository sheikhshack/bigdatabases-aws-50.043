import React, { useEffect, useState } from 'react'
import '../styles/bookStyle.css'

const ShakeSingularBook = ({ book }) => {


    // U can the define here functions for the specific component. See this sample
    const printTheTitle = () => {
        console.log('The asin clicked is: ', book.asin)
    }



    return(
        <div className='Book' onClick={() => printTheTitle() }>
            <div className='BookImage'>
                <img src={book.imUrl} ></img>
            </div>
            <div className='BookInfo'>
                <h1>Book Title</h1>
                <p className='Author'>by {book.author}</p>
                <p className='BookPrice'>${book.price}</p>
            </div>
        </div>
    )
}

export default ShakeSingularBook