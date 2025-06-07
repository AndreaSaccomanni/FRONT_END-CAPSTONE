import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ChiSono from "./ChiSono";
import ServiceSection from "./ServiceSection";
import FormContattami from "./FormContattami";
import HeroSection from "./HeroSection";
import videoSfondo from "/src/assets/video/sfondoAnimato.mp4";

const Home = () => {
  return (
    <Container fluid className="home-container text-light px-0">
      {/* Hero Section */}
      <HeroSection />

      <section id="next-section" className=" text-center">
        <ChiSono />
      </section>

      <section className="mt-5">
        <ServiceSection />
      </section>

      {/*---- VIDEO DI SFONDO -----*/}
      {/* <section className="sezione-video-bg text-center mt-4 pb-2 position-relative">
        
        <video autoPlay muted loop className="video-background ">
          <source src={videoSfondo} type="video/mp4" />
        </video>

        
        <div className="contenuto-form position-relative z-1">
          <Row>
            <Col md={4}></Col>
            <Col md={4}>
              <h2 className="py-0 my-0">Vuoi iniziare il tuo percorso?</h2>
              <FormContattami />
            </Col>
            <Col md={4}></Col>
          </Row>
        </div>
      </section> */}

      <section className="sezione-video-bg text-center mt-4 pb-2">
        <Container fluid>
          <Row className="align-items-center">
            {/* Colonna video */}
            <Col md={8} className="col-video position-relative">
              <video autoPlay muted loop playsInline className="video-col">
                <source src={videoSfondo} type="video/mp4" />
              </video>
              {/* eventualmente puoi aggiungere un overlay con opacità o colore */}
            </Col>

            {/* Colonna form */}
            <Col md={4} className="d-flex flex-column align-items-center justify-content-center contenuto-form">
              <h2 className="py-0 my-0">Vuoi iniziare il tuo percorso?</h2>
              <FormContattami />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  );
};

export default Home;
