import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const UtentiComponent = () => {
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jwtToken = localStorage.getItem("jwtToken");

  // Fetch per ottenere tutti gli utenti
  useEffect(() => {
    fetch("http://localhost:8080/utenti/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore nella fetch: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setUtenti(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  const handleDelete = (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare questo utente?")) return;

    fetch(`http://localhost:8080/utenti/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella cancellazione dell'utente");
        }
        return response;
      })
      .then(() => {
        setUtenti((prev) => prev.filter((u) => u.id !== id));
        alert("Utente eliminato con successo!");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Lista Utenti</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && utenti.length === 0 && <Alert variant="warning">Nessun utente trovato.</Alert>}

      {!loading && utenti.length > 0 && (
        <Table striped bordered hover responsive="sm" variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Email</th>
              <th>Ruolo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {utenti.map((utente, index) => (
              <tr key={utente.id || index}>
                <td>{index + 1}</td>
                <td>{utente.nome}</td>
                <td>{utente.cognome}</td>
                <td>{utente.email}</td>
                <td>{utente.ruolo}</td>
                <td className="text-center">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(utente.id)}>
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UtentiComponent;
