import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Collapse } from "react-bootstrap";
import { Link } from "react-router-dom";

const ServiceSection = () => {
  const [openService, setOpenService] = useState(null);

  const servizi = [
    {
      id: 1,
      titolo: "Consulenza Personalizzata",
      descrizione: "Valutazione iniziale e miglioramento della scheda.",
      dettagli: [
        "**Valutazione iniziale**: Durante il primo incontro analizziamo il tuo stato fisico attuale, i tuoi obiettivi e le tue abitudini di allenamento.",
        "**Miglioramento della scheda**: Se hai già un programma di allenamento, lo ottimizziamo per renderlo più efficace e su misura per te.",
        "**Strategie personalizzate**: Ti forniamo consigli specifici su esercizi, alimentazione e recupero, basati sulle tue necessità.",
        "**Supporto continuo**: Dopo la consulenza, offriamo un follow-up per verificare i progressi e fare eventuali aggiustamenti."
      ],
      img: "/src/assets/images/consulenza.jpg"
    },
    {
      id: 2,
      titolo: "Massaggio Rilassante",
      descrizione: "Massaggio rilassante per alleviare lo stress.",
      dettagli: [
        "**Rilassamento profondo**: Questo massaggio aiuta a sciogliere le tensioni accumulate e favorisce un senso di benessere generale.",
        "**Riduzione dello stress**: Tecniche di massaggio mirate migliorano la circolazione sanguigna e riducono i livelli di cortisolo.",
        "**Oli essenziali**: Usiamo oli naturali con proprietà rilassanti, come lavanda e camomilla, per amplificare i benefici.",
        "**Miglioramento del sonno**: Un massaggio rilassante può aiutare a ridurre l'insonnia e migliorare la qualità del riposo."
      ],
      img: "/src/assets/images/rilassante.jpg"
    },
    {
      id: 3,
      titolo: "Massaggio Sportivo",
      descrizione: "Trattamento decontratturante per atleti.",
      dettagli: [
        "**Prevenzione degli infortuni**: Tecniche specifiche migliorano la flessibilità e riducono il rischio di lesioni muscolari.",
        "**Recupero accelerato**: Aiuta a eliminare l'acido lattico e migliora la circolazione per un recupero più rapido dopo l'allenamento.",
        "**Adatto a tutti**: Non solo per atleti, ma anche per chiunque soffra di tensioni muscolari e voglia migliorare la mobilità.",
        "**Massaggio mirato**: Personalizziamo il trattamento in base alle esigenze, concentrandoci sulle aree più soggette a stress e tensione."
      ],
      img: "/src/assets/images/decontratturante.jpg"
    },
    {
      id: 4,
      titolo: "Applicazione Tape",
      descrizione: "Tecnica non invasiva per il supporto muscolare e articolare.",
      dettagli: [
        "**Sostegno muscolare**: I cerotti aiutano a stabilizzare i muscoli senza limitare il movimento.",
        "**Riduzione del dolore**: Stimola i recettori cutanei per diminuire la percezione del dolore nelle zone trattate.",
        "**Miglioramento della circolazione**: Favorisce il drenaggio linfatico e riduce il gonfiore in caso di traumi o infiammazioni.",
        "**Adatto a varie esigenze**: Utile in ambito sportivo, posturale o riabilitativo, per adulti e bambini."
      ],
      img: "/src/assets/images/taping.avif"
    }
  ];

  // const isVisible = () => {
  //   return localStorage.getItem("jwtToken") ? true : false;
  // };

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
          {servizi.map((servizio) => (
            <Collapse key={servizio.id} in={openService === servizio.id}>
              <div className="dettagli-container">
                <h3 className="text-center mt-4">{servizio.titolo}</h3>
                <ul className="text-muted text-center list-unstyled">
                  {servizio.dettagli.map((dettaglio, index) => (
                    <li key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: dettaglio.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  ))}
                </ul>
              </div>
            </Collapse>
          ))}
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
