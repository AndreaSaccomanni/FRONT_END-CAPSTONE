import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const FormContattami = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    messaggio: ""
  });

  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/contatto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setInviato(true);
        setErrore(false);
        setFormData({ nome: "", cognome: "", email: "", messaggio: "" });
      } else {
        setErrore(true);
        setInviato(false);
      }
    } catch (err) {
      console.error(err);
      setErrore(true);
    }
  };

  return (
    <Container className="container-form">
      <h2 className="mb-3">Contattami</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control type="text" name="cognome" value={formData.cognome} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Messaggio</Form.Label>
          <Form.Control as="textarea" rows={5} name="messaggio" value={formData.messaggio} onChange={handleChange} required />
        </Form.Group>

        <Button type="submit" variant="primary">
          Invia
        </Button>
      </Form>

      {inviato && <p className="mt-3 text-success">Messaggio inviato con successo!</p>}
      {errore && <p className="mt-3 text-danger">Errore nell'invio. Riprova più tardi.</p>}
    </Container>
  );
};

export default FormContattami;
