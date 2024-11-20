import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export const NoRecords = ({ message = "No records to show" }) => {
    return (

        <tr>
            <td colSpan={12}>
                <div className={"noRecords-container"}>
                    <span className={'noRecords-container-icon'}>
                        <FaExclamationTriangle />
                    </span>
                    <span className={'noRecords-container-text'}>
                        {message}
                    </span>
                </div>
            </td>
        </tr>


    )
}
