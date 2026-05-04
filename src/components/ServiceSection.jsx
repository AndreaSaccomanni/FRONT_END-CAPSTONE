import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ServiceSection = () => {
  const [openService, setOpenService] = useState(null);

  const servizi = [
    {
      id: 1,
      titolo: "Piano di Allenamento Personalizzato",
      descrizione: "Pianificazione di un ciclo di allenamenti o aggiornamento della scheda precedente.",
      dettagli: [
        "**Valutazione iniziale**: Durante il primo incontro analizziamo il livello di allenamento, il punto di partenza e tracciamo la direzione da intraprendere.",
        "**Programmazione**: Struttura del piano di allenamento su 8 settimane, personalizzato per durata, tipologia e impegni quotidiani.",
        "**Supporto continuo**: Comunicazione costante ed eventuale follow-up per aggiustamenti durante il percorso.",
        "**Check up finale**: Valutazione alla fine del percorso ed eventuale pianificazione del proseguimento."
      ],
      img: "/src/assets/images/consulenza.jpg"
    },
    {
      id: 2,
      titolo: "Massaggi",
      descrizione: "Massaggio rilassante per alleviare lo stress.",
      dettagli: [
        "**Massaggio rilassante**: Prenditi cura di te e goditi un massaggio completo per ridurre lo stress e le tensioni emotive. 30 min | 1h",
        "**Massaggio sportivo**: Tecniche manuali per favorire il recupero post esercizio o sciogliere contratture muscolari. 30 min | 1h"
      ],
      img: "/src/assets/images/rilassante.jpg"
    },
    {
      id: 3,
      titolo: "Personal Training",
      descrizione: "Allenamento 1 a 1",
      dettagli: [
        "**Seduta di allenamento 1 a 1.**: Tecniche specifiche migliorano la flessibilità e riducono il rischio di lesioni muscolari.",
        "**Allenamento individuale per calciatori - tecnica individuale - Ball Mastery (min.10 anni)**: ",
        "**Allenamento per bambini 8+**:",
        "**Allenamento cognitivo per anziani**: "
      ],
      img: "/src/assets/images/decontratturante.jpg"
    },
    {
      id: 4,
      titolo: "Trattamento infortuni",
      descrizione: "Percorso personalizzato per il recupero da infortuni, mirato a ripristinare mobilità, forza e funzionalità in sicurezza.",
      dettagli: [
        "**Recupero post-infortunio**: Sedute 1 a 1 per recuperare lo stato di forma pre infortunio in accordo con il tuo fisioterapista",
        "**Gestione delle problematiche**: Trattamento di problemi articolari o muscolari tramite il movimento",
        "**Applicazione tape kinesiologico**: Favorisce il drenaggio linfatico e riduce il gonfiore a seguito di traumi o infiammazioni.",
        "**Adatto a varie esigenze**: Utile in ambito sportivo, posturale o riabilitativo, per adulti e bambini."
      ],
      img: "/src/assets/images/taping.avif"
    }
  ];

  const toggleService = (id) => {
    setOpenService(openService === id ? null : id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll(".card-wrapper");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Container fluid id="servizi" className="pt-4 mt-5 px-4">
      <h2 className="text-center my-2 fs-1 fw-bold">I miei servizi</h2>
      {/* Sezione Card */}
      <Row className="justify-content-center">
        {servizi.map((servizio, index) => (
          <Col key={servizio.id} lg={3} md={6} sm={12} className={` mt-4 mt-md-4 mb-md-4  d-flex card-wrapper ${index < 2 == 0 ? "from-right" : "from-left"}`}>
            <Card className="fixedCard flex-grow-1">
              <Card.Img variant="top" src={servizio.img} alt={servizio.titolo} />
              <div className="overlay"></div>
              <Card.Body>
                <Card.Title className="text-center">{servizio.titolo}</Card.Title>
                <Card.Text className="text-center">{servizio.descrizione}</Card.Text>
                <Button variant="link" className="d-block mx-auto mt-2 text-decoration-none link-arancione" onClick={() => toggleService(servizio.id)}>
                  {openService === servizio.id ? "Nascondi dettagli" : "Scopri di più"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Sezione Descrizione Dettagliata con Collapse */}
      <Row className="mt-5">
        <Col>
          {servizi.map((servizio) =>
            openService === servizio.id ? (
              <div key={servizio.id} className="dettagli-container">
                <h3 className="text-center mt-4">{servizio.titolo}</h3>
                <ul className="text-muted text-center list-unstyled">
                  {servizio.dettagli.map((dettaglio, index) => (
                    <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: dettaglio.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </Col>
      </Row>

      {/* Pulsante Prenota o Messaggio Login */}
      {/* <Row className="mt-5">
        <Col className="text-center">
          {isVisible() ? (
            <Link to="/creaprenotazione" className="btn btn-primary btn-lg">
              Prenota
            </Link>
          ) : (
            <p className="mt-3 mt-md-0 text-light">
              Per effettuare una prenotazione è necessario fare il{" "}
              <Link to="/login" className="link-arancione fw-bold">
                login
              </Link>{" "}
              o{" "}
              <Link to="/registrazione" className="link-arancione fw-bold">
                registrarsi
              </Link>
              .
            </p>
          )}
        </Col>
      </Row> */}
    </Container>
  );
};

export default ServiceSection;
