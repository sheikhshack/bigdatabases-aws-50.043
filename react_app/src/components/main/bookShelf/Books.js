// <<<<<<< jerokokneedshelp
import React, { Component } from 'react'
import '../main.css'
import Book from './book/Book'
import retrieveBook from '../../../services/bookService' //extracting book json objects from get request
// =======
// import React, { Component } from 'react';
// import '../main.css';
// import Book from './book/Book';
// import retrieveBook from '../../../services/bookService'; //extracting book json objects from get request
// import sampleBook from '../../sample/db.json';  //extracting sample book info from local json file
// >>>>>>> jeroe

class Books extends Component {
    render() {
        let bookCards = []
        for (let i = 0; i < 12; i++) {
            bookCards.push(<Book></Book>)
            /**todo: populate individual book based from data taken from json response:
        }
        return (
            <div className='Books'>
                {bookCards}
            </div>
        )
    }

}
export default Books
