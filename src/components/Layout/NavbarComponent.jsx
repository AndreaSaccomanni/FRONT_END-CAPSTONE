// src/components/Layout/NavbarComponent.jsx
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "/src/assets/images/logo.webp";

const NavbarComponent = () => {
  // !! --> per restituire sempre true o false, è come se fosse useState(Boolean(localStorage.getItem("jwtToken")))
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwtToken"));
  const userRole = localStorage.getItem("userRole");

  const isAdmin = userRole === "ADMIN" || userRole === "PERSONAL_TRAINER";

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("jwtToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Sei sicuro di voler effettuare il logout?");

    if (confirmLogout) {
      // Rimuove il token dal localStorage
      localStorage.removeItem("jwtToken");

      // Reindirizza alla homepage
      navigate("/");

      // Ricarica la pagina per aggiornare la navbar
      window.location.reload();
    }
  };

  return (
    <Navbar variant="dark" expand="lg" className=" navbar-gradient py-3 px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center">
          <img
            src={logo}
            alt="Logo AS"
            className="me-2"
            style={{ width: "40px", height: "40px", objectFit: "contain", filter: "drop-shadow(0px 0px 5px rgba(255, 140, 0, 0.5))" }}
          />
          Alessandro Saccomanni - PT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100 justify-content-between">
          <Nav className="me-auto text-center">
            <Nav.Link as={Link} to="/" className="px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/chiSono" className="px-3">
              Chi sono
            </Nav.Link>
            <Nav.Link as={Link} to="/servizi" className="px-3">
              Servizi
            </Nav.Link>
            <Nav.Link as={Link} to="/creaprenotazione" className="px-3">
              Prenota
            </Nav.Link>
          </Nav>
          <Nav className="text-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" className="px-3">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/registrazione" className="px-3">
                  Registrati
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/prenotazioni" className="px-3">
                  Prenotazioni
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/utenti" className="px-3">
                    Utenti
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout} className="px-3 text-danger">
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
