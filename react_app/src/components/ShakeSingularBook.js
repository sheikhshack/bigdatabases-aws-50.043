import React, { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import '../styles/bookStyle.css'

const ShakeSingularBook = ({ book }) => {

    const asin = book.asin
    const history = useHistory()

    // U can the define here functions for the specific component. See this sample
    const GoToTitle = () => {
        console.log('The asin clicked is: ', asin)
        history.push(`/book/${asin}`)
    }


    return (
        <div className='Book' onClick={() => GoToTitle()}>
            <div className='BookImage'>
                <img src={book.imUrl} ></img>
            </div>
            <div className='BookInfo'>
                <h1>{book.title}</h1>
                <p className='Author'>by {book.author}</p>
                <p className='BookPrice'>${book.price}</p>
            </div>
        </div>
    )
}

export default ShakeSingularBook