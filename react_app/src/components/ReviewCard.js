import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Column, Row, Item } from '@mui-treasury/components/flex';
import { Info, InfoSubtitle, InfoTitle } from '@mui-treasury/components/info';
import { Typography } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating';
import genericProfileIcon from '../assets/genericProfileIcon.jpg'


const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    transition: '0.3s',
    position: 'relative',
    '&:before': {
      transition: '0.2s',
      position: 'absolute',
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      backgroundColor: '#d9daf1',
      borderRadius: '1rem',
      zIndex: 0,
      bottom: 0,
    }
    // ,
    // '&:hover': {
    //   '&:before': {
    //     bottom: -2,
    //   },
    //   '& $card': {
    //     boxShadow: '-3px 3px 16px 0 #bcc3d6',
    //   },
    // },
  },
  card: {
    zIndex: 1,
    position: 'relative',
    borderRadius: '1rem',
    boxShadow: '0 3px 10px 0 #dbdbe8',
    backgroundColor: '#fff',
    transition: '0.4s',
    height: '100%',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: '0.75rem',
  },
  avatar: {
    fontFamily: 'Ubuntu',
    fontSize: '0.875rem',
    backgroundColor: '#6d7efc',
  },
  join: {
    background: 'linear-gradient(to top, #638ef0, #82e7fe)',
    '& > *': {
      textTransform: 'none !important',
    },
  },
}));

// { reviewerName, reviewTime, reviewText, rating}
const ReviewCard = ({review}) => {
  console.log('this is the review to show')
  console.log(review)
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Column className={styles.card}>
        <Row p={2} gap={2}>
          <Avatar className={styles.logo} variant={'rounded'} src={genericProfileIcon} />
          <Info position={'middle'}>
            <InfoTitle>{review.User===null
                        ?"*Name unavailable*"
                        :review.User.reviewerName}</InfoTitle>
            <Typography variant="caption" fontStyle="italic">{'Reviewed on:'+review.reviewTime}</Typography>
            <InfoSubtitle>
                <Rating name="read-only" size="small"  value={review.overall} readOnly />
            </InfoSubtitle>
          </Info>
        </Row>
        <Box pb={1} px={2} color={'grey.600'} fontSize={'0.875rem'}>
            <Typography  variant="body1">{review.reviewText}</Typography>
        </Box>
      </Column>
    </div>
  );
};


export default ReviewCard