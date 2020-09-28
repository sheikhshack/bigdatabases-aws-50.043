import React from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Navigation = ({ user }) => {

    return (
        <>
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
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    <div className="pull-right btn-toolbar" style={{ margin:10 }}>
                        {/*TODO: This part here is a quicky way for me to check user state lol*/}
                        {user === null?
                            <Button>USER OUT</Button>:
                            <Button>USER IN</Button> }
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </>
    )


}

export default Navigation