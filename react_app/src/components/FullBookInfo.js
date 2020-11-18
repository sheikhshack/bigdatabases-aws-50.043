import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import store from '../store'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'
import reviewService from '../services/reviewService'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import CardActionArea from '@material-ui/core/CardActionArea'
import Pagination from '@material-ui/lab/Pagination';
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Chip from "@material-ui/core/Chip";
import ReviewCard from '../components/ReviewCard.js'
import AddReviewForm from '../components/AddReviewForm.js'
import '../styles/fullBook.css'

const SingularRelated = ({ relatedItem, juiced }) => {
    const history = useHistory()
    const goToView = () => {
        console.log('The asin clicked is: ', relatedItem)
        history.push(`/book/${relatedItem.asin}`)
        juiced()

    }

    return (
        <Card className='book' onClick={() => goToView()}>
            <CardActionArea >
                <CardMedia className='image'>
                    <img src={relatedItem.imUrl} />
                </CardMedia>
                <CardContent >
                    <Typography className='title' gutterBottom variant="body1" component="body1" >
                        {relatedItem.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Author: {relatedItem.author} <br></br>
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const ClusteredRelated = ({ books, juiced }) => {
    // console.log(books)

    return (
        <div>
            <Box pl={10} pr={10}>
                <Typography gutterBottom variant="h5" component="h5">Customers also viewed</Typography>
                <Box display="flex" justifyContent="flex-start" Scroll overflow="auto">
                    {books.map(book =>
                        <SingularRelated key={book.asin} relatedItem={book} juiced={juiced} />
                    )}
                </Box>
            </Box>
        </div>
    )

}

const FullBookInfo = ({ asin }) => {
    const [book, setBook] = useState({})
    const [related, setRelated] = useState([])
    const [categories, setCategories] = useState([])
    const [reviews,setReviews] = useState([])
    const [reload, setReload] = useState(false)
    const reviewsPerPage = 5;
    const [noOfPages,setNoOfPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const numReviewsToPull = 20
    const [lastReviewPulled, setLastReviewPulled] = useState(20)
    const [allReviewsPulled, setAllReviewsPulled] = useState(false)

    const dispatch = useDispatch()

    // const unsubscribe = store.subscribe(() => {
    //     if(reviews.length <= store.getState().reviews[asin].length){
    //         setReviews(store.getState().reviews[asin])
    //     }
    // })

    const juicit = () => {
        setReload(!reload)
    }

    useEffect(() => {
        async function fetchBook() {
            console.log(asin)
            const bookData = await bookService.singleBookMode(asin)
            // console.log('response')
            // console.log(bookData.related_buys)
            setBook(bookData)
            setRelated(bookData.related_buys)
            setCategories(bookData.categories[0])
        }

        fetchBook()
        
        async function getReviews(){
            const getreviews = await reviewService.reviewsBasedonAsin(asin,0,lastReviewPulled)
            setReviews(getreviews)
            // dispatch(getReviews(asin,0,6))
            // console.log('All my reviews')
            // const bookReviews = store.getState().reviews[asin]
            // setReviews(bookReviews)
            // console.log(reviews)
            setNoOfPages(Math.ceil(getreviews.length / reviewsPerPage))
        }

        if(reviews.length===0){
            getReviews()
        }

    }, [reload])

    const addMoreReviews = async () =>{
        return await reviewService.reviewsBasedonAsin(asin,lastReviewPulled+1,lastReviewPulled+numReviewsToPull)
    }
    
    const handlePageFlip = async (event, value) => {
        if (value === (noOfPages-1)){
            console.log(value)
            console.log(noOfPages)
            const getMoreReviews = await reviewService.reviewsBasedonAsin(asin,lastReviewPulled+1,lastReviewPulled+numReviewsToPull)
            // const getMoreReviews = addMoreReviews()
            if(getMoreReviews.length>0){
                setLastReviewPulled(lastReviewPulled+getMoreReviews.length)
                var newReviews = [...reviews]
                newReviews.concat(getMoreReviews)
                // newReviews.push(getMoreReviews)
                setReviews(newReviews)
                setNoOfPages(Math.ceil(reviews.length / reviewsPerPage))
            }
        }
        setCurrentPage(value);
      };


    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 345,
        },
        media: {
            width: '80%'
        },
        detailer: {
            width: '100%',
            backgroundColor: theme.palette.background.paper
        }
    }))

    const fullBook = useStyles()

    if (book !== null) {

        return (
            <div>
                <Grid container>
                    <Grid item xs={4}>
                        <Box display="flex" justifyContent="flex-end" >
                            <img className={fullBook.media} src={book.imUrl} />
                        </Box>
                        <Box justifyContent="flex-end" pl={25} >
                            <List alignItems='flex-start' classname={fullBook.detailer} >
                                <ListItem divider={true}>
                                    <ListItemText primary="Author" secondary={book.author}></ListItemText>
                                </ListItem>
                                <ListItem divider={true}>
                                    <ListItemText primary="Price" secondary={book.price}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="ASIN" secondary={book.asin}></ListItemText>
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography gutterBottom variant="h3" component="h3" >{book.title}</Typography>
                            <hr />
                            <Box fontStyle="italic">
                                <Typography variant="body1" fontStyle="italic" >{book.description}</Typography>
                            </Box>
                            <Box>
                                {categories.map(cat =>
                                    <Box key={cat} p={1}>
                                        <Chip color='primary' label={cat} />
                                    </Box>
                                )}
                            </Box>
                            <Box>
                            <br/>
                            <Grid container direction={'row'} justify='space-between' spacing={2}>
                                <Grid item>
                                    <Typography gutterBottom variant="h4" component="h4" >Book Reviews</Typography>
                                </Grid>
                                <Grid item>
                                    <AddReviewForm reviewBook={book} handleAddReview={(review) => {
                                        // console.log("one review")
                                        // console.log(review)
                                        // console.log("All reviews before")
                                        // console.log(reviews.length)
                                        // reviews.unshift(review)
                                        var newReviews = [...reviews]
                                        newReviews.unshift(review)
                                        // console.log("All reviews after")
                                        // console.log(reviews.length)
                                        setReviews(newReviews)
                                    }}/>
                                </Grid>
                            </Grid>
                            <hr />
                            <Grid container direction="column" justify="center" spacing={1}>
                                {
                                (reviews.length>0)
                                    ?reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage).map(review => (
                                    <Grid key={review.id} item>
                                        <ReviewCard key={review.id} review={review} ></ReviewCard>
                                    </Grid>
                                    ))
                                    :<Typography  variant="body1">{'No reviews as of now. Add one!'}</Typography>
                                }
                            </Grid>
                            <hr />
                            <Box component="span">
                                <Pagination
                                count={noOfPages}
                                page={currentPage}
                                onChange={handlePageFlip}
                                defaultPage={1}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                                />
                            </Box>
                        </Box>
                        </Box>
                    </Grid>
                </Grid>
                <br/>
                <Divider></Divider>

                <div>
                    {/*<h1>{related[0].title}</h1>*/}
                    <ClusteredRelated books={related} juiced={juicit}></ClusteredRelated>

                </div>

            </div>

        )
    }
    else {
        return (
            <div>
                <h1> Loading </h1>
            </div>
        )

    }
}

export default FullBookInfo