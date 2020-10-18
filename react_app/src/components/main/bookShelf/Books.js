import React, { Component } from 'react'
import '../main.css'
import Book from './book/Book'
import retrieveBook from '../../../services/bookService' //extracting book json objects from get request

class Books extends Component {
    render() {
        let bookCards = []
        for (let i = 0; i < 12; i++) {
            bookCards.push(<Book></Book>)
            /**todo: populate individual book based from data taken from json response:
             * book price, book title, image URl provided in the json object (hopefully it works ah lol)
            */
        }
        return (
            <div className='Books'>
                {bookCards}
            </div>
        )
    }

}
export default Books
