import Box from '@material-ui/core/Box';
import React from 'react';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';

const useStyles = makeStyles((theme)=>({
    root: {
        flexGrow: 1,
      },
      paper: {
        padding: "40px",
        margin: 'auto',
        maxWidth: 800,
        minWidth: 800,
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
    }));
    
const SearchResultCard = ({book}) => {

    const classes = useStyles();

    const asin = book.asin
    const history = useHistory()

    const GoToTitle = () => {
        console.log('The asin clicked is: ', asin)
        history.push(`/book/${book.asin}`)
    }

    return (
        <div className={classes.root}> 
            <Paper className={classes.paper}> 
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="Book Picture" src={book.imUrl} onClick={() => GoToTitle()} />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Author: {book.author}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Asin: {book.asin}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={() => GoToTitle()}>
                                    More Info
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">
                                Price : ${book.price}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
  }

export default SearchResultCard
