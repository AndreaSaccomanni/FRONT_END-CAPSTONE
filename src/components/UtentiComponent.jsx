import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Modal, Form, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";

const UtentiComponent = () => {
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUtente, setSelectedUtente] = useState(null);
  const [modalError, setModalError] = useState("");

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
      .then((data) => setUtenti(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  // Aprire il modale con i dati dell'utente selezionato
  const openEditModal = (utente) => {
    console.log("ID dell'utente selezionato:", utente.id);
    if (!utente.id) {
      alert("Errore: ID utente non trovato!");
      return;
    }

    // Formattare la data di nascita in modo corretto per il campo date
    let formattedDate = utente.dataDiNascita ? utente.dataDiNascita.split("T")[0] : "";

    setSelectedUtente({ ...utente, dataDiNascita: formattedDate });
    setModalError(""); // Reset eventuali errori precedenti
    setShowModal(true);
  };

  // Eliminare un utente
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

  // funzione che viene chiamata quando premo il tasto di salvataggio delle modifiche utente nel modale
  const handleEdit = () => {
    if (!selectedUtente.id) {
      setModalError("Errore: ID utente non trovato!");
      return;
    }

    const payload = {
      nome: selectedUtente.nome,
      cognome: selectedUtente.cognome,
      dataDiNascita: selectedUtente.dataDiNascita || null, // Se non viene fornita, inviamo null
      username: selectedUtente.username,
      email: selectedUtente.email,
      ruolo: selectedUtente.ruolo
    };

    //fetch per modificare l'utente selezionato
    fetch(`http://localhost:8080/utenti/update/${selectedUtente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Errore nella modifica dell'utente");
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("Utente aggiornato con successo!");
        setShowModal(false);
        setUtenti((prev) => prev.map((u) => (u.id === selectedUtente.id ? data : u)));
      })
      .catch((err) => setModalError(err.message));
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
              <th>Data di nascita</th>
              <th>Username</th>
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
                <td>{new Date(utente.dataDiNascita).toLocaleDateString("it-IT")}</td>
                <td>{utente.username}</td>
                <td>{utente.ruolo}</td>
                <td className="text-center">
                  <TfiPencilAlt className="icon-edit me-2 mt-1" style={{ cursor: "pointer", color: "orange" }} onClick={() => openEditModal(utente)} />
                  <FaTrashAlt className="icon-delete ms-3 mt-1" style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(utente.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modale per modificare utente */}
      {selectedUtente && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton className="bg-dark text-light">
            <Modal.Title>Modifica Utente</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            {modalError && <Alert variant="danger">{modalError}</Alert>}

            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" value={selectedUtente.nome} onChange={(e) => setSelectedUtente({ ...selectedUtente, nome: e.target.value })} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control type="text" value={selectedUtente.cognome} onChange={(e) => setSelectedUtente({ ...selectedUtente, cognome: e.target.value })} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                type="date"
                value={selectedUtente.dataDiNascita || ""}
                onChange={(e) => setSelectedUtente({ ...selectedUtente, dataDiNascita: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="bg-dark text-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Chiudi
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Salva Modifiche
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default UtentiComponent;
