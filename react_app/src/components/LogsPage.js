import React, { useEffect, useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Pagination from '@material-ui/lab/Pagination'
import Box from '@material-ui/core/Box'
import logService from '../services/logService'

const PaginatorSimple = ({ currPage, setCurrPage }) => {
    const handleChange = (event, page) => {
        window.scrollTo(0, 0)   //shift page back to the top on every page change
        setCurrPage(page)
    }
    return (
        <Pagination size="large" count={100} page={currPage} onChange={handleChange} />
    )
}

const LogsPage =({ logData }) => {

    const [url, setUrl] = useState('')
    const [method, setMethod] = useState('')
    const [httpVersion, setHttpVersion] = useState('')
    const [statusCode, setStatusCode] = useState('')
    const [responseTime, setResponseTime] = useState('')
    const [id, setId] = useState('')
    const [timestamp, setTimestamp] = useState('')
    const [level, setLevel] = useState('')
    const [message, setMessage] = useState('')
    const [logs, setLogs] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const [logdisplay, setLogdisplay] = useState(null)



    const useStyles = makeStyles({
        root: {
            minWidth: 100,
            fontWeight: 'bold',
            color: 'inherit',
        },
        container: {
            minWidth: 1000,
            fontWeight: 'bold',
            color: 'inherit',
        }

    })

    const logQuery = { pagenumber: currPage, sort: 'timestamp', order: -1, limitnumber: 20 }
    console.log(logQuery)



    useEffect(() => {
        async function fetchLogs() {
            let logData = await logService.getPaginatedLogs(logQuery)
            console.log(logData)
            setLogs(logData)
        }
        fetchLogs()
    }, [currPage])



    const classes = useStyles()

    return (
        <div style={{ color: 'black', padding: '0', width: '100%' , height: 700 }}>
            <TableContainer className={classes.paper} component={Paper}>
                <Table className={classes.root} aria-label="simple table">
                    <TableHead style={{ fontWeight: 'fontWeightBold' }}>
                        <TableRow>
                            <TableCell align="left">Timestamp</TableCell>
                            <TableCell align="left">URL</TableCell>
                            <TableCell align="left">Method</TableCell>
                            <TableCell align="left">HTTP Version</TableCell>
                            <TableCell align="left">Status Code</TableCell>
                            <TableCell align="left">Response Time&nbsp;(ms)</TableCell>
                            <TableCell align="left">ID</TableCell>
                            <TableCell align="left">Level</TableCell>
                            <TableCell align="left">Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((row) => (
                            <TableRow key={row.name}>
                                {/* <TableCell component="th" scope="row"> {row.name}</TableCell> */}
                                <TableCell align="left">{row.timestamp}</TableCell>
                                <TableCell align="left">{row.meta.req.url}</TableCell>
                                <TableCell align="left">{row.meta.req.method}</TableCell>
                                <TableCell align="left">{row.meta.req.httpVersion}</TableCell>
                                <TableCell align="left">{row.meta.res.statusCode}</TableCell>
                                <TableCell align="left">{row.meta.responseTime}</TableCell>
                                <TableCell align="left">{row._id}</TableCell>
                                <TableCell align="left">{row.level}</TableCell>
                                <TableCell align="left">{row.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box display='flex' justifyContent='center'>
                    <PaginatorSimple currPage={currPage} setCurrPage={setCurrPage} />
                </Box>
            </TableContainer>
        </div>
    )
}

export default LogsPage
