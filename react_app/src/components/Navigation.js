import React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { Link, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import SelectSearch from 'react-select-search'
import bookService from "../services/bookService"
import { Redirect } from "react-router-dom"
import { useEffect, useState } from 'react'
import SelectInput from '@material-ui/core/Select/SelectInput'


const Navigation = ({ user }) => {

    //hook to store URL
    const [state, setState] = useState("")

    //hook to store user input
    const [input, setInput] = useState("")

    const dispatch = useDispatch()
    const history = useHistory()

    const logoutFromNav = () => {
        if (window.confirm('Wanna log out?')){
            dispatch(logout())
        }

    }

    const queryTitle = (title) => {
        console.log(title)
        bookService.queryBookByTitle(String(title)).then(response =>
            {
                //const history = useHistory()
                console.log(response)
                console.log(response[0].asin)
                setState(response[0].asin)
                //history.push(`http://localhost:3000/`)
            });
    }


    const options = [
        {name: 'Title', value: 'title'},
        {name: 'Author', value: 'author'},
    ];


    if (state != ""){
        return (<Redirect to={"/book/"+state}/>)}
    else{
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand >DB Project</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/users">Users</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>

                    </Nav>
                    <Form inline>
                        <SelectSearch options={options} value="sv" name="searchBy" placeholder="Search by" />
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(e) => setInput(e.target.value)}/>
                        <Button variant="outline-success" onClick = {(e) => {queryTitle(input)}} > Search</Button>
                    </Form>
                    <div className="pull-right btn-toolbar" style={{ margin:10 }}>
                        {/*TODO: This part here is a quicky way for me to check user state lol*/}
                        {user === null?
                            <Button onClick={() => history.push('/login')}>LOGIN</Button>:
                            <Button onClick={logoutFromNav}>Hi {user.name}</Button> }
                    </div>
                </Navbar.Collapse>
            </Navbar>

        )
    }


}

export default Navigation