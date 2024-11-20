import React from 'react'

export const Input = ({ id, type, value, onChange, label, errorMessage, isInvalid }) => {
    return (
        <div className='mb-3'>
            <label htmlFor={id} className='form-label'>
                {label}
            </label>
            <input
                type={type}
                className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
                id={id}
                value={value}
                onChange={onChange}
            />
            {isInvalid && <div className="invalid-feedback">{errorMessage}</div>}
        </div>
    )
}
