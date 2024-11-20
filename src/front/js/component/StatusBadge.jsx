import React from 'react'
import { Badge } from 'react-bootstrap'

export const StatusBadge = ({ status }) => {

    const mapStatus = {
        active: { name: "Active", variant: "primary" },
        completed: { name: "Completed", variant: "success" },
        expired: { name: "Expired", variant: "warning" }
    }

    return (

        <Badge bg={mapStatus[status].variant}>
            {mapStatus[status].name}
        </Badge>

    )
}
