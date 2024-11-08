import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "./Logout.jsx";
import { Context } from "../store/appContext.js";
import { BrandLogo } from "./BrandLogo.jsx";
export const Navbar = () => {
	const { store } = useContext(Context);
	// const [dropdownOpen, setDropdownOpen] = useState(false);
	// const toggleDropdown = () => {setDropdownOpen(!dropdownOpen);};
	const navigate = useNavigate()

	const login = () => {
		navigate("/")
	}
	return (
		<nav className="navbar sticky-top">
			<div className="navbar-brand">
				<Link to={store.isLogin ? "/dashboard" : "/dashboard"}>
					<BrandLogo />
				</Link>
			</div >
			<ul className="nav-links m-0">
				<div className="nav-item">
					<Link to={"about-us"} className="navbar-custom-link">About us</Link>
				</div>
				<Link to={"contact-us"} className="navbar-custom-link">Contactanos</Link>
			</ul>
			<button className="cta-button">
				{store.isLogin ?
					<Logout />
					:
					<div className="logout" onClick={login}>
						<i className="fa-solid fa-right-to-bracket"></i>
					</div>
				}
			</button>
		</nav >
	);
}
