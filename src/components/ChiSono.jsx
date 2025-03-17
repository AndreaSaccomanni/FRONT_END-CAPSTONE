import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const ChiSono = () => {
  return (
    <Container className="my-5 chi-sono-container">
      <h2 className="text-center mb-5">Chi sono</h2>
      <Row className="align-items-center">
        {/* Colonna Immagine */}
        <Col md={5} className="text-center">
          <Image src="/src/assets/images/immagineProfilo.jpg" alt="Alessandro Saccomanni" className="foto-profilo" rounded />
        </Col>

        {/* Colonna Testo */}
        <Col md={7}>
          <p>
            Mi chiamo <strong>Alessandro Saccomanni</strong> e sono un <strong>Personal Trainer</strong> con una forte passione per il benessere fisico e
            mentale. Il mio obiettivo è aiutarti a migliorare la tua forma fisica, aumentare le tue performance e raggiungere un equilibrio tra corpo e mente.
          </p>
          <h4 className="mt-4">📚 Percorso di studi</h4>
          <ul>
            <li>
              🏋🏻‍♂️ Certificazione in Personal Training presso <strong>[Nome Istituto]</strong>
            </li>
            <li>📖 Specializzazione in Allenamento Funzionale e Biomeccanica</li>
            <li>🧘‍♂️ Corsi di aggiornamento su Massaggi Sportivi e Rilassanti</li>
          </ul>

          <h4 className="mt-4">🏆 Esperienze</h4>
          <ul>
            <li>✅ Esperienza pluriennale nell’allenamento individuale e di gruppo</li>
            <li>✅ Collaborazione con centri fitness e palestre specializzate</li>
            <li>✅ Trattamenti personalizzati per atleti e appassionati di fitness</li>
          </ul>

          <p className="mt-4">
            Credo che ogni persona abbia <strong>bisogni unici</strong>, per questo il mio approccio è <strong>completamente personalizzato</strong>. Se vuoi
            migliorare il tuo stile di vita e prenderti cura del tuo corpo, <strong>sono qui per aiutarti!</strong>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ChiSono;
