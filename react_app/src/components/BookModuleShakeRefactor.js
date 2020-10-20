import React, { useEffect, useState } from 'react'
import '../styles/main.css'
import bookService from '../services/bookService'
import ShakeSingularBook from './ShakeSingularBook'

const BookModuleShakeRefactor = () => {

    // Hook declarations //
    const [books, setBooks] = useState([])

    // Effect Hooks //
    // This hook will retrieve the books on every render
    useEffect(() => {
        async function fetchBooks() {
            const bookData = await bookService.getAllBooksRanged(0, 16)
            setBooks(bookData)
        }
        fetchBooks()
    }, [])
    return (
        <div className='Books'>
            {books.map(book =>
                <ShakeSingularBook key={book.asin} book={book} />
            )}
        </div>
    )
}

export default BookModuleShakeRefactor


