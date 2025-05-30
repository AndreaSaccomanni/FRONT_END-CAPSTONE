import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ChiSono from "./ChiSono";
import ServiceSection from "./ServiceSection";
import FormContattami from "./FormContattami";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <Container fluid className="home-container text-light">
      {/* Hero Section */}
      <HeroSection />

      <section id="next-section" className="mt-3 text-center">
        <h2 className="mb-2">Chi sono?</h2>
        {/* <p className="mx-auto" style={{ maxWidth: "800px" }}>
          Sono un <strong>personal trainer</strong> con una grande passione per il benessere fisico e mentale. Il mio obiettivo è aiutarti a raggiungere i tuoi
          obiettivi con un approccio personalizzato, ascoltando le tue esigenze e adattando ogni trattamento su misura per te.
        </p>
        <div className="d-flex justify-content-center">
          <Button variant="warning" as={Link} to="/chiSono" className="btn-lg mt-3 ">
            info su di me
          </Button>
        </div> */}
        <ChiSono />
      </section>

      <section className="mt-5">
        <h2 className="text-center mb-2">Cosa posso offrirti?</h2>
        {/* <Row className="justify-content-center">
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
        </Row> */}
        <ServiceSection />
        {/* <div className="d-flex justify-content-center">
          <Button variant="warning" as={Link} to="/servizi" className="btn-lg mt-3 ">
            Scopri i servizi
          </Button>
        </div> */}
      </section>

      <section className="text-center mt-4 pb-2">
        <h2 py-0 my-0>
          Vuoi iniziare il tuo percorso?
        </h2>
        <FormContattami />
      </section>
    </Container>
  );
};

export default Home;
