import React from "react";
import { Carousel, Col, Container, Row } from "react-bootstrap";

const img1 = `${import.meta.env.BASE_URL}assets/images/partenza.avif`;
const img2 = `${import.meta.env.BASE_URL}assets/images/scalata.avif`;
const img3 = `${import.meta.env.BASE_URL}assets/images/passo.avif`;
const img4 = `${import.meta.env.BASE_URL}assets/images/traguardo2.avif`;

const MotivationalCarousel = () => {
  const slides = [
    {
      img: img1,
      caption: "Ogni vetta comincia da valle. Il primo passo non ti porterà subito in alto, ma ti toglierà dal punto di partenza"
    },
    {
      img: img2,
      caption: "All’inizio la salita sembra più dura, ma è lì che il corpo si adatta e la mente si rafforza"
    },
    {
      img: img3,
      caption: "Non serve correre, serve salire un passo alla volta. È la costanza che ti porta in cima."
    },
    {
      img: img4,
      caption: "Quando raggiungi la vetta, capisci che ogni passo, ogni sforzo, ne è valsa la pena"
    }
  ];

  return (
    <Carousel controls indicators interval={5000} fade className="motivational-carousel mt-5">
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <Container fluid className="px-4 py-3">
            <Row className="align-items-center">
              <Col md={5} className="mb-3 mb-md-0">
                <img className="d-block w-100 rounded" src={slide.img} alt={`Slide ${index}`} />
              </Col>
              <Col md={7}>
                <div className="carousel-text-wrapper p-4">
                  <p className=" fw-semibold font-motivazionale m-0">{slide.caption}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MotivationalCarousel;
