import React, { useState } from "react";
import { Container, Row, Col, Image, Collapse, Button } from "react-bootstrap";

const ChiSono = () => {
  const [openStudi, setOpenStudi] = useState(false);
  const [openEsperienze, setOpenEsperienze] = useState(false);

  return (
    <Container className="my-5 chi-sono-container">
      <Row className="align-items-center">
        {/* Colonna Immagine */}
        <Col md={4} className="text-center">
          <Image src="/src/assets/images/immagineProfilo.jpg" alt="Alessandro Saccomanni" className="foto-profilo" rounded />
        </Col>

        {/* Colonna Testo */}
        <Col md={8} className="pe-0 text-start">
          <p className="fs-5">
            Mi chiamo <strong>Alessandro Saccomanni</strong>, sono un <strong>Chinesiologo Sportivo</strong> e <strong>Personal Trainer</strong>. Il mio
            percorso di studi mi ha permesso di sviluppare un <strong>approccio olistico</strong> all’attività fisica che mi permette di adattarla alle{" "}
            <strong>necessità individuali</strong> considerando anche gli <strong>aspetti psicologici</strong> dei clienti, che siano atleti, novizi o
            appassionati. Il metodo che utilizzo è incentrato sul percorso da compiere <strong>insieme</strong> piuttosto che sulla meta da raggiungere, in modo
            da poter instaurare fiducia e consapevolezza di sé nella persona che assisto. La mia passione per tutto ciò che riguarda il movimento umano stimola
            la <strong>ricerca</strong> e l’<strong>aggiornamento</strong> costanti per garantirvi un servizio efficace e <strong>science-based</strong>.
          </p>
          <p className="mt-2 fs-5">
            Credo che ogni persona abbia <strong>bisogni unici</strong>, per questo il mio approccio è <strong>completamente personalizzato</strong>. Se vuoi
            migliorare il tuo stile di vita e prenderti cura del tuo corpo, <strong>sono qui per aiutarti!</strong>
          </p>
          <div className="d-flex align-items-center ">
            <h4 className="mt-2 cursor-pointer">
              <span className="icone-chiSono">📚</span> Percorso di studi
            </h4>
            <Button variant="warning" className="btn-md ms-4 " onClick={() => setOpenStudi(!openStudi)}>
              scopri di più
            </Button>
          </div>
          <Collapse in={openStudi}>
            <ul>
              <li>
                <div className="d-flex">
                  <span className="me-2"> 📖 </span>{" "}
                  <span>
                    Laurea Triennale in Scienze motorie e Sportive presso
                    <strong> Università degli studi di Roma “Foro Italico”</strong>
                  </span>
                </div>
              </li>

              <li>
                <div className="d-flex">
                  <span className="me-2">🎓</span>{" "}
                  <span>
                    Laurea magistrale in Scienza e tecnica dello Sport presso
                    <strong> Università degli studi di Roma “Foro Italico”</strong>
                  </span>
                </div>
              </li>
              <li>
                <span className="me-2">🧘‍♂️</span>Massaggiatore sportivo CONI – <strong>Istituto ATS</strong>
              </li>
            </ul>
          </Collapse>
          <div className="d-flex align-items-center mt-4 ">
            <h4 className="mt-2 cursor-pointer">
              <span className="icone-chiSono coppa">🏆</span> Esperienze
            </h4>
            <Button variant="warning" className="btn-md ms-4 " onClick={() => setOpenEsperienze(!openEsperienze)}>
              scopri di più
            </Button>
          </div>
          <Collapse in={openEsperienze}>
            <ul>
              <li>
                <span className="me-2">✅</span>Istruttore Ginnastica Posturale presso Sporting Village 2.0
              </li>
              <li>
                <span className="me-2">✅</span>Istruttore attività motoria per l’età evolutiva
              </li>
              <li>
                <span className="me-2">✅</span>Massaggiatore
              </li>
              <li>
                <span className="me-2">✅</span>Trattamenti personalizzati per atleti e appassionati di fitness
              </li>
            </ul>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
};

export default ChiSono;
