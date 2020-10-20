import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function MediaCard() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Lizard
          </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
          </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Share
        </Button>
                <Button size="small" color="primary">
                    Learn More
        </Button>
            </CardActions>
        </Card>
    );
}
// import React from "react";
// import { MemoryRouter, Route } from "react-router";
// import { Link } from "react-router-dom"; // Parameter update does not work, pagination does work.
// //import { Link } from "@reach/router"; // Parameter update works, pagination does not work.
// import Pagination from "@material-ui/lab/Pagination";
// import PaginationItem from "@material-ui/lab/PaginationItem";

// export default function PaginationLink() {
//     return (
//         <MemoryRouter initialEntries={["/inbox"]} initialIndex={0}>
//             <Route>
//                 {({ location }) => {
//                     const query = new URLSearchParams(location.search);
//                     const page = parseInt(query.get("page") || "1", 10);
//                     return (
//                         <Pagination
//                             page={page}
//                             count={10}
//                             renderItem={item => (
//                                 <PaginationItem
//                                     component={Link}
//                                     to={`/inbox${item.page === 1 ? "" : `?page=${item.page}`}`}
//                                     {...item}
//                                 />
//                             )}
//                         />
//                     );
//                 }}
//             </Route>
//         </MemoryRouter>
//     );
// }