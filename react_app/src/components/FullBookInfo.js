import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import '../styles/bookStyle.css'
import bookService from '../services/bookService'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Card from '@material-ui/core/Card'
import Chip from "@material-ui/core/Chip";
import ReviewCard from '../components/ReviewCard.js'

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
                <CardMedia >
                    <img src={relatedItem.imUrl} />
                </CardMedia>
                <CardContent >
                    <Typography gutterBottom variant="body1" component="body1">
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

const ClusteredRelated = ({ books, juiced}) => {
    console.log(books)

    return (
        <div>
            <Box pl={15}>
                <Typography gutterBottom variant="h5" component="h5">Customers also viewed</Typography>
                <Box display="flex" justifyContent="flex-start"  >
                    {books.map(book =>
                        <SingularRelated key={book.asin} relatedItem={book} juiced={juiced} />
                    )}
                </Box>
            </Box>
        </div>
    )

}

const FullBookInfo = ({asin}) => {
    // get request
    // const { asin } = useParams()
    const [book, setBook] = useState({})
    const [related, setRelated] = useState([])
    const [categories, setCategories] = useState([])
    const [reload, setReload] = useState(false)

    const juicit = () => {
        setReload(!reload)
    }

    useEffect(() => {
        async function fetchBook() {
            const bookData = await bookService.singleBookMode(asin)
            console.log('response')
            console.log(bookData.related_buys)
            setBook(bookData)
            setRelated(bookData.related_buys)
            setCategories(bookData.categories[0])
        }
        fetchBook()

    }, [reload])


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

    if (book !== null){

        return (
            <div>
                <Grid container>
                    <Grid item xs={4}>
                        <Box display="flex" justifyContent="flex-end" >
                            <img className={fullBook.media} src={book.imUrl} />
                        </Box>
                        <Box  justifyContent="flex-end" pl={25} >
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
                                <Typography  variant="body1" fontStyle="italic" >{book.description}</Typography>
                            </Box>
                            <Box>
                                {categories.map(cat =>
                                    <Box key={cat} p={1}>
                                        <Chip color='primary' label={cat} />
                                    </Box>
                                )}
                            </Box>
                            <Box>
                            <Typography gutterBottom variant="h4" component="h4" >Book Reviews</Typography>
                            <hr />
                            <Grid container direction="column" justify="center" spacing={1}>
                                <Grid item>
                                    <ReviewCard reviewerName={'Gail'} reviewTime={'Reviewed on: 03 28, 2014'} reviewText={'The Iron Marshall, by Louie L`Amour is one of his best. Of course all of his are the best.Louie is a man who knew the west. His books make it possible to really feel how it was.'} rating={'5'} ></ReviewCard>
                                </Grid>
                                <Grid item>
                                    <ReviewCard reviewerName={'Jose'} reviewTime={'Reviewed on: 27 10, 2020'} reviewText={'Aeneid is a latin poem. Not a fan of latin poetry'} rating={'2'} ></ReviewCard>
                                </Grid>
                            </Grid>
                            {/* <Box fontStyle="italic">
                                <Typography  variant="body1" fontStyle="italic" >Book reviews</Typography>
                            </Box> */}
                        </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Divider></Divider>

                <div>
                    {/*<h1>{related[0].title}</h1>*/}
                    <ClusteredRelated books={related} juiced={juicit}></ClusteredRelated>

                </div>

            </div>

        )
    }
    else {
        return(
            <div>
                <h1> Loading </h1>
            </div>
        )

    }
}

export default FullBookInfo