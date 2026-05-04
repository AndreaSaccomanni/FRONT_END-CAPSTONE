// src/components/Layout/NavbarComponent.jsx
import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "/src/assets/images/logo.webp";

const NavbarComponent = () => {
  // !! --> per restituire sempre true o false, è come se fosse useState(Boolean(localStorage.getItem("jwtToken")))
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwtToken"));
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();

  const isAdmin = userRole === "ADMIN" || userRole === "PERSONAL_TRAINER";

  //controllo pwe vedere se l'utente si è autenticato in base alla presenza del token nel localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("jwtToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  //logout
  const handleLogout = () => {
    const confirmLogout = window.confirm("Sei sicuro di voler effettuare il logout?");

    if (confirmLogout) {
      // Rimuove i dati dal localStorage
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("nomeUtente");

      // Reindirizza alla homepage
      navigate("/");

      // Ricarica la pagina per aggiornare la navbar
      window.location.reload();
    }
  };
  const location = useLocation();

  const isHome = location.pathname === "/";

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  return (
    <Navbar expand="md" className={`navbar-gradient py-3 px-3 ${isHome ? "navbar-transparent text-light" : "navbar-dark"}`}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center navbar-brand-responsive" style={{ color: "white" }}>
          <img
            src={logo}
            alt="Logo AS"
            className="me-2"
            style={{ color: "white", width: "43px", height: "43px", objectFit: "contain", filter: "drop-shadow(0px 0px 5px rgba(255, 140, 0, 0.5))" }}
          />
          Alessandro Saccomanni - PT
        </Navbar.Brand>
        {/* Custom toggler for mobile: opens Offcanvas. Keep it only on small screens (Navbar expand="md") */}
        <Button variant="link" className="d-md-none p-0" onClick={handleShowOffcanvas} aria-controls="offcanvasNav" aria-label="Apri menu">
          <span className="navbar-toggler-icon" />
        </Button>

        <Navbar.Collapse id="basic-navbar-nav" className="w-100 justify-content-between">
          <Nav className="me-auto text-center">
            <Nav.Link as={Link} to="/" className="px-3">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/indirizzo" className="px-3">
              Indirizzi
            </Nav.Link>

            <Nav.Link as={Link} to="/creaprenotazione" className="px-3">
              Prenota
            </Nav.Link>
          </Nav>
          <Nav className="text-center d-none d-md-flex">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" className={`px-3 ${isHome ? "nav-link-red" : "nav-link"}`}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/registrazione" className={`px-3 ${isHome ? "nav-link-red" : "nav-link"}`}>
                  Registrati
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/prenotazioni" className={`px-3 `}>
                  Prenotazioni
                </Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/utenti" className={`px-3 ${isHome ? "nav-link-red" : "nav-link"}`}>
                    Utenti
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout} className={`px-3 text-danger ${isHome ? "nav-link-red" : "nav-link"}`}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>

        {/* Offcanvas for mobile menu */}
        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start" id="offcanvasNav">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" onClick={handleCloseOffcanvas}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/indirizzo" onClick={handleCloseOffcanvas}>
                Indirizzi
              </Nav.Link>
              <Nav.Link as={Link} to="/creaprenotazione" onClick={handleCloseOffcanvas}>
                Prenota
              </Nav.Link>

              <hr />

              {!isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/login" onClick={handleCloseOffcanvas}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/registrazione" onClick={handleCloseOffcanvas}>
                    Registrati
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/prenotazioni" onClick={handleCloseOffcanvas}>
                    Prenotazioni
                  </Nav.Link>
                  {isAdmin && (
                    <Nav.Link as={Link} to="/utenti" onClick={handleCloseOffcanvas}>
                      Utenti
                    </Nav.Link>
                  )}
                  <Nav.Link
                    onClick={() => {
                      handleCloseOffcanvas();
                      handleLogout();
                    }}
                    className="text-danger"
                  >
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
