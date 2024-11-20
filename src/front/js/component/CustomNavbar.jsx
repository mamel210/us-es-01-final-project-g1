import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Logout } from "./Logout.jsx";
import { Context } from "../store/appContext.js";
import { BrandLogo } from "./BrandLogo.jsx";

export const CustomNavbar = () => {
	const { store } = useContext(Context);
	const navigate = useNavigate()

	return (
		<Navbar
			expand="lg"
			style={{
				backgroundColor: "var(--primary)",
				padding: "0px 30px",
			}}
		>
			<Container fluid>
				<Navbar.Brand as={Link} to={store.isLogin ? "/dashboard" : "/"}>
					<BrandLogo className="navbar-custom-link-logo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto nav-links">
						<Nav.Link as={Link} to="about-us" className="navbar-custom-link">
							About Us
						</Nav.Link>
						<Nav.Link as={Link} to="exercises" className="navbar-custom-link">
							Exercises
						</Nav.Link>
						<Nav.Link as={Link} to="training-plan" className="navbar-custom-link">
							Training Plans
						</Nav.Link>
						<Nav.Link as={Link} to="sessions" className="navbar-custom-link">
							Sessions
						</Nav.Link>
						<Nav.Link as={Link} to="muscles" className="navbar-custom-link">
							Muscles
						</Nav.Link>
						<Nav.Link as={Link} to="how-it-works" className="navbar-custom-link">
							How it Works?
						</Nav.Link>
					</Nav>
					<Nav>
						<Nav.Link className="logInLogOut-button" onClick={store.isLogin ? null : () => navigate("/")}>
							{store.isLogin ? <Logout /> : <i className="fa-solid fa-right-to-bracket"></i>}
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
