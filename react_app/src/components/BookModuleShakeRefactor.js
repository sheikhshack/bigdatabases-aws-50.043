import React, { useEffect, useState } from 'react'
import '../styles/main.css'
import bookService from '../services/bookService'
import ShakeSingularBook from './ShakeSingularBook'
import paginator from './Paginator'
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";



const PaginatorSimple = ({ currPage, setCurrPage }) => {


    const handleChange = (event, page) => {
        console.log('Fired with data', page, event)
        window.scrollTo(0, 0)   //shift page back to the top on every page change
        setCurrPage(page)
    }


    return (
        <Pagination size="large" count={10} page={currPage} onChange={handleChange} />

    )

}

const BookModuleShakeRefactor = () => {

    // Hook declarations //
    const [books, setBooks] = useState([])
    const [currPage, setCurrPage] = useState(1)

    // Effect Hooks //
    // This hook will retrieve the books on every render
    useEffect(() => {
        async function fetchBooks() {
            const bookData = await bookService.getPaginatedBooks(currPage)
            setBooks(bookData)
        }
        fetchBooks()
    }, [currPage])
    return (
        <div className='cons'>
            <div className='Books'>
                {books.map(book =>
                    <ShakeSingularBook key={book.asin} book={book} />
                )}
            </div>
            {/*<div className='paginator'>*/}
            {/*    /!* {paginator()}  *!/*/}
            {/*    <Grid*/}
            {/*        container spacing={0}*/}
            {/*        direction="column"*/}
            {/*        alignItems='center'*/}
            {/*    >*/}
            {/*        <Grid>*/}
            {/*            {paginator()}*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</div>*/}
            {/*Boss sexy anot my no css mode*/}
            <Box display='flex' justifyContent='center'>
                <PaginatorSimple currPage={currPage} setCurrPage={setCurrPage} />
            </Box>
        </div>

    )
}

export default BookModuleShakeRefactor



