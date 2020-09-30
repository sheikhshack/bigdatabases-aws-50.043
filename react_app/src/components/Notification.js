import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

// TODO: Bootstrap it
const Notification = () => {
    const notification = useSelector(state => state.notification)
    // we standardise modes can only be 'success', 'danger' and 'warning' for now
    if (notification === null){
        return null
    }

    return (
        <Alert variant={notification.mode}>
            {notification.message}
        </Alert>
    )
}

export default Notification