import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logout } from "./Logout.jsx";


export const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<nav className="navbar ">
			<div className="navbar-brand">
				<Link to={"dashboard"}>PowerPulse</Link>
			</div>
			<ul className="nav-links m-0">
				<div className="nav-item">
					<Link to={"about-us"}>About us</Link>
				</div>
				<Link to={"contact-us"}>Contactanos</Link>
			</ul>
			<button className="cta-button"><Logout /></button>
		</nav>
	);
}
