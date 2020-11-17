import React from 'react'
import { useSelector } from 'react-redux'
import Alert from '@material-ui/lab/Alert'

// TODO: Bootstrap it
const Notification = () => {
    const notification = useSelector(state => state.notification)
    // we standardise modes can only be 'success', 'info' and 'warning' for now
    if (notification === null){
        return null
    }

    return (
        <>
            <Alert severity={notification.mode}>
                {notification.message}
            </Alert>
        </>
    )
}

export default Notification