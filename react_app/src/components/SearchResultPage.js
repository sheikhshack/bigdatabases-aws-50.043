import SearchResultCard from "./SearchResultCard"
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import BookModuleShakeRefactor from "./BookModuleShakeRefactor"
import '../styles/main.css'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import ShakeSingularBook from './ShakeSingularBook'
import bookService from '../services/bookService'
import { makeStyles } from '@material-ui/core/styles'




const handleAlertClick = () => {
    setTimeout(() => {
        alert("There are no books that fit the search result");
    },1);
}

const SearchResultPage = ({searchtype,searchinput}) => {

    const [books, setBooks] = useState([])
    console.log('search type (resultpage) is:'+searchtype)
    console.log('search input (resultpage) is:'+searchinput)

    useEffect(() => {
        async function fetchBookResults() {
            console.log('search type (useEffect) is:'+ searchtype)
            console.log('search input (useEffect) is:'+ searchinput)
    
            let bookData
                if (searchtype == "Author"){
                    bookData = await bookService.queryBookByAuthor(searchinput)
                        setBooks(bookData) 
                }
                if (searchtype == "Title"){
                    bookData = await bookService.queryBookByTitle(searchinput)
                    console.log("bookdata is:" + bookData)    
                    // if (bookData == null){
                    //     console.log("theres nothing")
                    // }
                    setBooks(bookData)        
                }   
                else {
                    console.log("theres nothing")
                    // handleAlertClick()
                }
            
            
        }
        // async function fetchBookResults() {
        //     let bookData
        //     if (searchinput != null){
        //         bookData = await bookService.queryBookByTitle(searchinput)
        //         console.log(searchinput)
        //     }
        //     setBooks(bookData)
        // }
        fetchBookResults()
        console.log(books)
    },[searchinput,searchtype])

    return (
        <>
            <Grid container spacing={4} direction="column" alignItems='center'>
                <div className='cons'>
                    <div className='Books'>
                        {books.map(book =>
                            <SearchResultCard key={book.asin} book={book} />
                        )}
                    </div>
                </div>
            </Grid>
        </>

    )
}

export default SearchResultPage

