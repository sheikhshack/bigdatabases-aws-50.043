import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'

const FullBookInfo = () => {
    // get request
    const { asin } = useParams();
    const [book, setBook] = useState([])

    useEffect(() => {
        async function fetchBook() {
            const bookData = await bookService.queryBookByAsin(asin)
            setBook(bookData[0])
            console.log('response')
            console.log(bookData[0].imUrl)
        }
        fetchBook();

    }, []);
    console.log('book')
    console.log(book.imUrl)
    return (
        <div>
            <h1>{asin}</h1>
            <img src={book.imUrl}></img>
            <p>Title: {book.title} <br></br>Price: {book.price}</p>
        </div>
    )
}

export default FullBookInfo