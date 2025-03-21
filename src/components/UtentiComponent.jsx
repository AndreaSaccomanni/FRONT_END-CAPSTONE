import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Modal, Form, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { IoPersonAddOutline } from "react-icons/io5";

const UtentiComponent = () => {
  const [utenti, setUtenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUtente, setSelectedUtente] = useState(null);
  const [modalError, setModalError] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newUtente, setNewUtente] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    username: "",
    password: "",
    ruolo: "USER"
  });

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

  // Aprire il modale di modifica con i dati dell'utente selezionato
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

  // modifica utente
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
        //aggiorna la lista degli utenti
        //mappa tutti gli utenti e per ogni utente confronta l'id dell'utente modificato
        //se corrisponde cambia i dati di quell'utente con quelli ricevuti dalla fetch
        //altrimenti l'utente rimane invariato
        //il risultato sarà la lista di tutti gli utenti che  conterrà anche l'utente modificato con i valori aggiornati
        ///aggiornando solo quelli modificato e il resto rimarranno invariati
        setUtenti((prev) => prev.map((u) => (u.id === selectedUtente.id ? data : u)));
      })
      .catch((err) => setModalError(err.message));
  };

  //aggiungere nuovo utente
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/utenti/registrazione", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify(newUtente)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Errore durante la registrazione");
      }

      alert("Utente aggiunto con successo!");
      setShowRegisterModal(false);

      // Aggiorna la lista utenti
      setUtenti((prev) => [...prev, data]);

      // Resetta i dati del form
      setNewUtente({
        nome: "",
        cognome: "",
        email: "",
        username: "",
        password: "",
        dataDiNascita: "",
        ruolo: "USER"
      });
    } catch (err) {
      alert("Errore: " + err.message);
    }
  };

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div></div>
        <h2 className="mx-auto  mt-2">Lista Utenti </h2>
        <div>
          <Button className="btn-primary" style={{ marginLeft: "-133px" }} onClick={() => setShowRegisterModal(true)}>
            <IoPersonAddOutline className="mb-1 me-2" /> Aggiungi Utente
          </Button>
        </div>
      </div>

      {/* Bottone per aggiungere un nuovo utente */}

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && utenti.length === 0 && <Alert variant="warning">Nessun utente trovato.</Alert>}

      {!loading && utenti.length > 0 && (
        <div className="table-responsive">
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
                  <td className="d-flex justify-content-center align-item-center">
                    <TfiPencilAlt className="icon-edit me-2 mt-1" style={{ cursor: "pointer", color: "orange" }} onClick={() => openEditModal(utente)} />
                    <FaTrashAlt className="icon-delete ms-3 mt-1" style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(utente.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={selectedUtente.email} onChange={(e) => setSelectedUtente({ ...selectedUtente, email: e.target.value })} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                type="date"
                value={selectedUtente.dataDiNascita || ""}
                onChange={(e) => setSelectedUtente({ ...selectedUtente, dataDiNascita: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={selectedUtente.username} onChange={(e) => setSelectedUtente({ ...selectedUtente, username: e.target.value })} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Ruolo</Form.Label>
              <Form.Select value={selectedUtente.ruolo} onChange={(e) => setSelectedUtente({ ...selectedUtente, ruolo: e.target.value })}>
                <option value="ADMIN">ADMIN</option>
                <option value="PERSONAL_TRAINER">PERSONAL_TRAINER</option>
                <option value="USER">USER</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="bg-dark text-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Chiudi
            </Button>
            <Button className="btn-primary" variant="primary" onClick={handleEdit}>
              Salva Modifiche
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Modale per aggiungere un nuovo utente */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Aggiungi Nuovo Utente</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form onSubmit={handleRegister}>
            <Form.Group>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci nome"
                value={newUtente.nome}
                onChange={(e) => setNewUtente({ ...newUtente, nome: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci cognome"
                value={newUtente.cognome}
                onChange={(e) => setNewUtente({ ...newUtente, cognome: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci email"
                value={newUtente.email}
                onChange={(e) => setNewUtente({ ...newUtente, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Data di nascita</Form.Label>
              <Form.Control
                type="date"
                placeholder="Inserisci la data di nascita"
                value={newUtente.dataDiNascita}
                onChange={(e) => setNewUtente({ ...newUtente, dataDiNascita: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci username"
                value={newUtente.username}
                onChange={(e) => setNewUtente({ ...newUtente, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci password"
                value={newUtente.password}
                onChange={(e) => setNewUtente({ ...newUtente, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Ruolo</Form.Label>
              <Form.Select value={newUtente.ruolo} onChange={(e) => setNewUtente({ ...newUtente, ruolo: e.target.value })}>
                <option value="ADMIN">ADMIN</option>
                <option value="PERSONAL_TRAINER">PERSONAL_TRAINER</option>
                <option value="USER">USER</option>
              </Form.Select>
            </Form.Group>

            <Modal.Footer className="bg-dark text-light">
              <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
                Annulla
              </Button>
              <Button variant="primary" type="submit">
                Aggiungi Utente
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UtentiComponent;
