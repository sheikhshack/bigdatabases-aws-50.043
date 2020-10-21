import React, { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import '../styles/bookStyle.css'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles({
//     root: {
//         width: 350,
//         height: 550,
//     },
//     media: {
//         height: 350,
//     },
//     extras: {

//     }
// });

const ShakeSingularBook = ({ book }) => {

    // const classes = useStyles()

    const asin = book.asin
    const history = useHistory()

    // U can the define here functions for the specific component. See this sample
    const GoToTitle = () => {
        console.log('The asin clicked is: ', asin)
        history.push(`/book/${asin}`)
    }


    return (
        <Card className='book' onClick={() => GoToTitle()}>
            <CardActionArea className='book1'>
                <CardMedia className='book-image'>
                    <img src={book.imUrl} />
                </CardMedia>
                <CardContent className='content'>
                    <Typography className='book-title' gutterBottom variant="h8" component="h5">
                        {book.title}
                    </Typography>
                    <Typography className='extras' variant="body2" color="textSecondary" component="p">
                        author: {book.author} <br></br>
                        price : {book.price}
                    </Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
                <Button size="small" color="primary">
                    Share
        </Button>
                <Button size="small" color="primary">
                    Learn More
        </Button>
            </CardActions> */}
        </Card>
    );

}

export default ShakeSingularBook

