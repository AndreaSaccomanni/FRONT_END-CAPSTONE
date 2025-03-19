import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const nomeUtente = localStorage.getItem("nomeUtente");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwtToken"));

  //controllo per vedere se l'utente è autenticato, se nel localStorage c'è il tokken o meno
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("jwtToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Container fluid className="home-container text-light">
      {/* Hero Section */}
      <section className="hero-section text-center d-flex flex-column justify-content-center align-items-center">
        {isAuthenticated ? <h2 className="mt-4 display-3 fw-bold nome-utente font-Arvo">Ciao {nomeUtente}</h2> : ""}
        {isAuthenticated ? (
          <h1 className="display-4 fw-bold mt-2">Migliora il tuo benessere!</h1>
        ) : (
          <h1 className="display-4 fw-bold mt-4">Migliora il tuo benessere!</h1>
        )}
        <p className="lead">Scopri un percorso personalizzato per migliorare la tua forma fisica con consulenze personalizzate e massaggi mirati.</p>
      </section>

      <section className="mt-3 text-center">
        <h2 className="mb-2">Chi sono?</h2>
        <p className="mx-auto" style={{ maxWidth: "800px" }}>
          Sono un <strong>personal trainer</strong> con una grande passione per il benessere fisico e mentale. Il mio obiettivo è aiutarti a raggiungere i tuoi
          obiettivi con un approccio personalizzato, ascoltando le tue esigenze e adattando ogni trattamento su misura per te.
        </p>
        <div className="d-flex justify-content-center">
          <Button variant="warning" as={Link} to="/chiSono" className="btn-lg mt-3 ">
            info su di me
          </Button>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-center mb-2">Cosa posso offrirti?</h2>
        <Row className="justify-content-center">
          <Col md={4} sm={12} className="text-center">
            <i className="fas fa-dumbbell fa-3x icon-arancione"></i>
            <h4 className="mt-3">Consulenze Personalizzate</h4>
            <p>Ti aiuto a creare un piano su misura per migliorare la tua forma fisica.</p>
          </Col>
          <Col md={4} sm={12} className="text-center">
            <i className="fas fa-spa fa-3x icon-arancione"></i>
            <h4 className="mt-3">Massaggi Rilassanti</h4>
            <p>Un momento di relax per sciogliere le tensioni e rigenerare corpo e mente.</p>
          </Col>
          <Col md={4} sm={12} className="text-center">
            <i className="fas fa-running fa-3x icon-arancione"></i>
            <h4 className="mt-3">Massaggi Sportivi</h4>
            <p>Ideale per migliorare il recupero muscolare e prevenire infortuni.</p>
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <Button variant="warning" as={Link} to="/servizi" className="btn-lg mt-3 ">
            Scopri i servizi
          </Button>
        </div>
      </section>

      <section className="text-center mt-4">
        <h2>Vuoi iniziare il tuo percorso?</h2>
        <Button variant="warning" as={Link} to="/creaprenotazione" className="btn-lg mt-3 mb-5">
          Prenota un appuntamento
        </Button>
      </section>
    </Container>
  );
};

export default Home;
