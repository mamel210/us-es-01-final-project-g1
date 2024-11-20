import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export const CustomModal = ({ show, onHide, title, children, footerButtons, size = "sm", customModalClassName }) => {

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size={size} className={customModalClassName}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {footerButtons ? (
                    footerButtons.map((button, index) => (
                        <Button
                            key={index}
                            variant={button.variant || 'secondary'}
                            onClick={button.onClick}
                        >
                            {button.label}
                        </Button>
                    ))
                ) : (
                    <Button size={"sm"} variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}
