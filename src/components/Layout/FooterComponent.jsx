import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const FooterComponent = () => {
  const location = useLocation(); // Ottiene l'URL corrente

  // Cambia lo sfondo in base alla pagina
  const footerClass = location.pathname === "/" ? "footer-home" : "footer-servizi";

  return (
    <footer className={`footer-gradient ${footerClass} text-white py-4`}>
      <Container>
        <hr className="footer-divider mb-3" />
        <Row className="justify-content-center text-center text-md-start">
          {/* Colonna Contatti */}
          <Col md={4} className="mb-3 text-center">
            <h5 className="footer-title">CONTATTI</h5>
            <div className="d-flex align-items-center justify-content-center">
              <span className="contact-icon">📧</span>
              <a href="mailto:saccales@hotmail.com" className="footer-link ms-2">
                saccales@hotmail.com
              </a>
            </div>

            <div className="d-flex align-items-center justify-content-center mt-2">
              <span className="contact-icon">📞</span>
              <a href="tel:+393772082714" className="footer-link ms-2">
                377 208 2714
              </a>
            </div>
          </Col>

          {/* Colonna Link Utili */}
          <Col md={4} className="mb-3 text-center">
            <h5 className="footer-title ">LINK UTILI</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/chiSono" className="footer-link">
                  Chi Sono
                </Link>
              </li>
              <li>
                <Link to="/servizi" className="footer-link">
                  Servizi
                </Link>
              </li>
            </ul>
          </Col>

          {/* Colonna Social */}
          <Col md={4} className="mb-3 text-center">
            <h5 className="footer-title">SEGUIMI</h5>
            <a href="https://www.instagram.com/_as_coach/" target="_blank" rel="noopener noreferrer" className="me-3 footer-social">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social">
              <i className="fab fa-facebook"></i>
            </a>
          </Col>
        </Row>

        {/* Copyright */}
        <hr className="footer-divider" />
        <div className="text-center mt-2">
          <small>© {new Date().getFullYear()} Alessandro Saccomanni - Personal Trainer</small>
        </div>
      </Container>
    </footer>
  );
};

export default FooterComponent;
