import React from 'react'
import { Link } from 'react-router-dom'


export const FormLayout = ({ goBackOnClick, title, onSubmit, customWidth, actionText, children, adionalActionHint, adionalActionPath, aditionalCallback, adionalActionText, customMessage }) => {
    return (
        <div className='container-fluid d-flex justify-content-center align-items-center p-0' style={{ height: '100vh' }}>
            <div className='row w-100 h-100 m-0 position-relative'>
                <div
                    className='col-12 position-absolute'
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '100%',
                        zIndex: 0
                    }}
                ></div>
                <div
                    className='col-12 d-flex justify-content-center align-items-center position-relative'
                    style={{ zIndex: 1 }}
                >
                    <div
                        className='card p-4'
                        style={{ width: customWidth || '400px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '10px' }}
                    >
                        <h2 className='text-center mb-4'>{title}</h2>
                        <form onSubmit={onSubmit}>
                            {children}
                            {goBackOnClick ? (
                                <div className="row">
                                    <div className="col-6">
                                        <button type='button' onClick={goBackOnClick} className='btn btn-secondary w-100'>
                                            go back!
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type='submit' className='btn btn-warning w-100'>
                                            {actionText}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button type='submit' className='btn btn-warning w-100'>
                                    {actionText}
                                </button>
                            )}
                            {customMessage ? <div className='text-center mt-3'>{customMessage} </div> : null}
                            {adionalActionText && (
                                <div className='text-center mt-3'>
                                    <p>
                                        {adionalActionHint} <Link onClick={aditionalCallback} to={adionalActionPath}>{adionalActionText}</Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
