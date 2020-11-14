import SearchResultCard from "./SearchResultCard"
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import BookModuleShakeRefactor from "./BookModuleShakeRefactor"
import '../styles/main.css'
import React, { useEffect, useState, useRef } from 'react'
import ShakeSingularBook from './ShakeSingularBook'
import bookService from '../services/bookService'
import { makeStyles } from '@material-ui/core/styles'



const SearchResultPage = ({searchinput}) => {
    const [books, setBooks] = useState([])
   
    console.log(searchinput)
    // const [searchTerm, setSearchTerm] = useState([]);

    // const handleChange = event => {
    //     setSearchTerm(searchinput);
    // }

    const useStyles = makeStyles((theme) => ({
           root: {
        //     flexGrow: 1,
        //     "& .makeStyles-paper-14": {
                
        //         padding: "40px",
        //         width: "800px"
        //     }

        }}))

        
    useEffect(() => {
        async function fetchBookResults() {
            console.log('search input is:')
            console.log(searchinput)
            let bookData
                    bookData = await bookService.queryBookByTitle(searchinput)
                    
                        console.log(searchinput)
                        console.log(typeof searchinput)
                        setBooks(bookData)
                    
                
                
                
            
                    // else {
                    //     console.log("theres nothing")
                    // }
            // if (sortMech === 1 ){
            //     bookData = await bookService.getPaginatedBooks(currPage, 20, 'reviews', order)
            // }
            // else if (sortMech === 2 ){
            //     bookData = await bookService.getPaginatedBooks(currPage, 20, 'categories', order)
            // }
            // else {
            //     bookData = await bookService.getPaginatedBooks(currPage)
            // }
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
    },[])

    return (
        <>
            <Box display='flex' justifyContent='flex-start'>
                {/* <Sorter sortMech={sortMech} setSortMech={setSortMech} order={order} setOrder={setOrder} setCurrPage={setCurrPage} /> */}
            </Box>
            <Grid container spacing={4} direction="column" alignItems='center'>
                <div className='cons'>
                    <div className='Books'>
                        {books.map(book =>
                            <SearchResultCard key={book.asin} book={book} />
                        )}
                    </div>
                    <Box display='flex' justifyContent='center'>
                        {/* <PaginatorSimple currPage={currPage} setCurrPage={setCurrPage} /> */}
                    </Box>
                </div>
            </Grid>
        </>

    )
}

export default SearchResultPage

