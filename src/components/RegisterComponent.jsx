import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dataDiNascita, setDataDiNascita] = useState("");
  const [ruolo, setRuolo] = useState("USER"); //ruolo di default --> "USER"
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non corrispondono.");
      return;
    }
    const utenteDTO = { nome, cognome, email, username, password, dataDiNascita, ruolo };
    try {
      const response = await fetch("http://localhost:8080/utenti/registrazione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(utenteDTO)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Errore durante la registrazione");
        return;
      }
      setSuccessMessage("Registrazione riuscita! Puoi ora effettuare il login.");
      setNome("");
      setCognome("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setDataDiNascita("");
      setRuolo("USER");
      setError("");
      navigate("/login");
    } catch (err) {
      setError("Errore durante la registrazione: " + err.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mt-3">Registrazione</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Inserisci il tuo nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="cognome">
              <Form.Label>Cognome</Form.Label>
              <Form.Control type="text" placeholder="Inserisci il tuo cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="dataDiNascita">
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control type="date" value={dataDiNascita} onChange={(e) => setDataDiNascita(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Inserisci il tuo username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Inserisci la tua email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Inserisci la tua password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Conferma Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Conferma la tua password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3 mb-5">
              Registrati ed effettua il Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterComponent;
