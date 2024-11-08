import React from 'react'

export const Input = ({ id, type, value, onChange, required = true, label }) => {
    return (
        <div className='mb-3'>
            <label htmlFor={id} className='form-label'>
                {label}
            </label>
            <input
                type={type}
                className='form-control'
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}
