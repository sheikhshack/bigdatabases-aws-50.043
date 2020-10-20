import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


const RelatedCarousell = () => {
    
}

const FullBookInfo = () => {
    // get request
    const { asin } = useParams()
    const [book, setBook] = useState({})

    useEffect(() => {
        async function fetchBook() {
            const bookData = await bookService.singleBookMode(asin)
            console.log('response')
            console.log(bookData.imUrl)
            setBook(bookData)
        }
        fetchBook()

    }, [])


    const useStyles = makeStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            width: '90%'
        }
    })

    const fullBook = useStyles();


    return (
        <div>
            <Grid container>
                <Grid item xs={4}>
                    <Box >
                        <img className={fullBook.media} src={book.imUrl} />
                    </Box>


                </Grid>
                <Grid item xs={6}>
                    <Typography gutterBottom variant="h3" component="h3" >{book.title}</Typography>
                    <Box fontStyle="italic">
                        <Typography  variant="body1" fontStyle="italic" >{book.description}</Typography>
                    </Box>
                </Grid>


            </Grid>
        </div>
        // <div>
        //     <h1>{asin}</h1>
        //     <img src={book.imUrl}></img>
        //     <p>Title: {book.title} <br></br>Price: {book.price}</p>
        // </div>
    )
}

export default FullBookInfo