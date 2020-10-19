import React, { Component } from 'react';
import '../main.css';
import Book from './book/Book';
import retrieveBook from '../../../services/bookService'; //extracting book json objects from get request
import sampleBook from '../../sample/db.json';  //extracting sample book info from local json file

class Books extends Component {
    render() {
        let bookCards = [];
        for (let i = 0; i < 12; i++) {
            bookCards.push(<Book title={sampleBook.metadata[0].title} img={sampleBook.metadata[0].imUrl} author={sampleBook.metadata[0].author} price={sampleBook.metadata[0].price}></Book>);
            /**todo: populate individual book based from data taken from json response: 
             * book price, book title, image URl provided in the json object (hopefully it works ah lol)
            */
        }
        return (
            <div className='Books'>
                {bookCards}
            </div>
        );
    }

}
export default Books;
