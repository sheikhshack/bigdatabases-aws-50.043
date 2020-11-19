import React, { useEffect, useState, useRef } from 'react'
import '../styles/main.css'
import bookService from '../services/bookService'
import ShakeSingularBook from './ShakeSingularBook'
import Pagination from '@material-ui/lab/Pagination'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Grid from '@material-ui/core/Grid'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'




const Sorter = ({ sortMech, setSortMech, order, setOrder, setCurrPage }) => {

    const options = ['Default', 'Review Count', 'Categories']
    const [open, setOpen] = useState(false)
    const anchorRef = useRef(null)


    const handleSortClick = (event, index) => {
        setCurrPage(1)
        setSortMech(index)
        setOpen(false)
    }
    const handleToggle = () => {
        setOpen(!open)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }
    const handleOrderChange = () => {
        console.log('Prev state is ', order)
        setOrder(order * -1)
    }

    return (
        <Box>
            <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                <Button color="primary" size="small" onClick={handleOrderChange}>
                    {order === 1? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </Button>
                <Button>Sort by {options[sortMech]}</Button>
                <Button color="primary" size="small" aria-controls={open ? 'split-button-menu' : undefined} aria-expanded={open ? 'true' : undefined} aria-label="select merge strategy" aria-haspopup="menu" onClick={handleToggle}>
                    <ArrowDropDownIcon />
                </Button>

            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                        <MenuItem key={option} selected={index === sortMech} onClick={(event) => handleSortClick(event, index)}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}

const PaginatorSimple = ({ currPage, setCurrPage }) => {
    const handleChange = (event, page) => {
        window.scrollTo(0, 0)   //shift page back to the top on every page change
        setCurrPage(page)
    }
    return (
        <Pagination size="large" count={currPage+10} page={currPage} onChange={handleChange} />
    )
}

const BookModuleShakeRefactor = () => {


    // Hook declarations //
    const [books, setBooks] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const [sortMech, setSortMech] = useState(0) // either 0 1(reviews) 2(categories)
    const [order, setOrder] = useState(1) // either 1 or -1

    // Effect Hooks //
    // This hook will retrieve the books on every render
    useEffect(() => {
        async function fetchBooks() {
            let bookData
            if (sortMech === 1 ){
                bookData = await bookService.getPaginatedBooks(currPage, 20, 'reviews', order)
            }
            else if (sortMech === 2 ){
                bookData = await bookService.getPaginatedBooks(currPage, 20, 'categories', order)
            }
            else {
                bookData = await bookService.getPaginatedBooks(currPage)
            }
            setBooks(bookData)
        }
        fetchBooks()
    }, [currPage, sortMech, order])
    return (
        <>
            <Box display='flex' justifyContent='flex-start'>
                <Sorter sortMech={sortMech} setSortMech={setSortMech} order={order} setOrder={setOrder} setCurrPage={setCurrPage} />

                <Grid container spacing={0} direction="column" alignItems='center'>
                    <div className='cons'>
                        <div className='Books'>
                            {books.map(book =>
                                <ShakeSingularBook key={book.asin} book={book} />
                            )}
                        </div>

                        <Box display='flex' justifyContent='center'>
                            <PaginatorSimple currPage={currPage} setCurrPage={setCurrPage} />
                        </Box>
                    </div>
                </Grid>
            </Box>
        </>

    )
}

export default BookModuleShakeRefactor



