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
            Mi chiamo <strong>Alessandro Saccomanni</strong>, sono un <strong>Chinesiologo Sportivo</strong> e <strong>Personal Trainer</strong>. Il mio
            percorso di studi mi ha permesso di sviluppare un <strong>approccio olistico</strong> all’attività fisica che mi permette di adattarla alle{" "}
            <strong>necessità individuali</strong> considerando anche gli <strong>aspetti psicologici</strong> dei clienti, che siano atleti, novizi o
            appassionati. Il metodo che utilizzo è incentrato sul percorso da compiere <strong>insieme</strong> piuttosto che sulla meta da raggiungere, in modo
            da poter instaurare fiducia e consapevolezza di sé nella persona che assisto. La mia passione per tutto ciò che riguarda il movimento umano stimola
            la <strong>ricerca</strong> e l’<strong>aggiornamento</strong> costanti per garantirvi un servizio efficace e <strong>science-based</strong>.
          </p>
          <h4 className="mt-4">
            <span className="icone-chiSono">📚</span> Percorso di studi
          </h4>
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

          <h4 className="mt-4">
            <span className="icone-chiSono coppa">🏆</span> Esperienze
          </h4>
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
