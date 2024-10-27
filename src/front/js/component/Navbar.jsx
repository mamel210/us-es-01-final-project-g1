import React, { useState } from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	return (
		<nav className="navbar">
			<div className="logo">PowerPulse</div>
			<ul className="nav-links m-0">
				<li><a href="#home">Inicio</a></li>
				<li><a href="#about">Sobre Nosotros</a></li>
				<li>
					<div className="dropdown">
						<button onClick={toggleDropdown} className="dropbtn">Servicios</button>
						{dropdownOpen && (
							<div className="dropdown-content ">
								<a href="#personal-training">Entrenamiento Personal</a>
								<a href="#nutrition">Nutrición</a>
								<a href="#group-classes">Clases Grupales</a>
							</div>
						)}
					</div>
				</li>
				<li><a href="#contact">Contacto</a></li>
			</ul>
			<button className="cta-button">Únete Ahora</button>
		</nav>
	);
}
