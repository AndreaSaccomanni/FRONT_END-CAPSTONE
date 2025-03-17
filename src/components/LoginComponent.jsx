// src/components/LoginComponent.jsx
import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/utenti/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error("Login fallito");
      }
      const data = await response.json();
      console.log("Login riuscito", data);
      // Salva il token dell'utente che si è autenticato in localStorage
      localStorage.setItem("jwtToken", data.token);
      // salva il ruolo
      localStorage.setItem("userRole", data.ruolo);
      //salva l'id dell'utente
      localStorage.setItem("userId", data.id);

      // ritorno alla Home
      navigate("/");

      window.location.reload();
    } catch (err) {
      setError("Errore durante il login: " + err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Inserisci il tuo username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Inserisci la password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComponent;
