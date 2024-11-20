import React from 'react'
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { FaDumbbell, FaClipboardList, FaPlay, FaChartLine } from 'react-icons/fa';

export const HowItWorks = () => {
    return (
        <Container style={{ color: "white", padding: "2rem" }}>
            <h1 className="text-center mb-5">How PowerPulse Works</h1>

            {/* Introducción */}
            <Row className="text-center mb-4">
                <Col>
                    <p>
                        PowerPulse is designed to empower your fitness journey by providing preloaded exercises, muscle details, and the ability to create personalized training plans. Follow the steps below to get started!
                    </p>
                </Col>
            </Row>

            {/* Paso 1: Ejercicios y Músculos Preestablecidos */}
            <Row className="mb-5">
                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <FaDumbbell size={100} color="var(--primary)" />
                </Col>
                <Col md={6}>
                    <Card bg="dark" text="light" className="p-3">
                        <Card.Body>
                            <Card.Title>1. Explore Preloaded Exercises & Muscles</Card.Title>
                            <Card.Text>
                                PowerPulse comes with a wide variety of exercises, muscle details, and categories preloaded, so you can focus on building your training plans and sessions without worrying about adding basic data.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Paso 2: Creación de Planes de Entrenamiento */}
            <Row className="mb-5">
                <Col md={6} order={2}>
                    <Card bg="dark" text="light" className="p-3">
                        <Card.Body>
                            <Card.Title>2. Create Your Training Plans</Card.Title>
                            <Card.Text>
                                Start by creating a personalized training plan. You can then assign exercises to this plan, making it fully customized to fit your goals.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-flex justify-content-center align-items-center order-md-1">
                    <FaClipboardList size={100} color="var(--primary-light)" />
                </Col>
            </Row>

            {/* Paso 3: Creación de Sesiones de Entrenamiento */}
            <Row className="mb-5">
                <Col md={6} className="d-flex justify-content-center align-items-center">
                    <FaPlay size={100} color="var(--primary-dark)" />
                </Col>
                <Col md={6}>
                    <Card bg="dark" text="light" className="p-3">
                        <Card.Body>
                            <Card.Title>3. Create Training Sessions</Card.Title>
                            <Card.Text>
                                With your training plan ready, you can create a training session and assign a plan to it. PowerPulse will automatically load all exercises included in the selected plan into the session for a seamless experience.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Paso 4: Seguimiento de Avances */}
            <Row className="mb-5">
                <Col md={6} order={2}>
                    <Card bg="dark" text="light" className="p-3">
                        <Card.Body>
                            <Card.Title>4. Track Your Progress</Card.Title>
                            <Card.Text>
                                During each session, you can track your progress by filling out a form with the exercises completed. Compare your performance with the set exercises to monitor your improvement over time.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-flex justify-content-center align-items-center order-md-1">
                    <FaChartLine size={100} color="var(--primary)" />
                </Col>
            </Row>

            {/* Sección final: Detalles Adicionales */}
            <Row className="text-center">
                <Col>
                    <Card bg="dark" text="light" className="p-3">
                        <Card.Body>
                            <Card.Text>
                                Additionally, you can explore detailed information about each exercise and muscle at any time, giving you the insights you need to make the most of your training.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
