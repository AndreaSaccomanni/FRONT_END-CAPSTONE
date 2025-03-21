import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Modal, Form, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";

const PrenotazioniComponent = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrenotazione, setSelectedPrenotazione] = useState(null);
  const [indirizzi, setIndirizzi] = useState([]);

  const [servizi, setServizi] = useState([]);

  const jwtToken = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  // fetch per prendere tutte le prenotazioni di tutti gli utenti se viene fatto l'accesso con ADMIN O PERSONAL_TRAINER
  //se viene fatto l'accesso da un utente deve mostrare tutte le prenotazioni di quell'utente se ce ne sono

  useEffect(() => {
    const endpoint =
      userRole === "ADMIN" || userRole === "PERSONAL_TRAINER"
        ? "http://localhost:8080/prenotazioni/all"
        : `http://localhost:8080/prenotazioni/utente/${userId}`;

    fetch(endpoint, {
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
        setPrenotazioni(data);
      })

      .catch((err) => setError(err.message))

      .finally(() => setLoading(false));
  }, [jwtToken, userRole, userId]);

  //fetch per prendere tutti i servizi dal database e metterli nel modale per la modifica di una prenotazione
  useEffect(() => {
    fetch("http://localhost:8080/servizi/all", {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero dei servizi");
        }
        return response.json();
      })
      .then((data) => setServizi(data))
      .catch((error) => console.error("Errore:", error));
  }, [jwtToken]);

  const openEditModal = (prenotazione) => {
    //CONVERSIONE DELLA DATA RISPETTO AL FUSO ORARIO

    //quando creo un oggetto Date ES. const dateObj = new Date("2025-03-11T15:00:00"); IN ITALIA VIENE LETTO COME --> Tue Mar 11 2025 16:00:00 GMT+0100 (Ora standard dell’Europa centrale)
    //L'ora UTC è 15:00, ma viene mostrata come 16:00 (perché in Italia abbiamo UTC+1)
    // dateObj.getTimezoneOffset() * 60000  -->  restituisce la differenza tra UTC (in italia UTC+1 in inverso e +2 in estate) e il fusorario locale e con *60000 la converte in millisecondi
    // dateObj.getTime() --> restituisce il valore della data in millisecondi
    // dateObj.getTime() - dateObj.getTimezoneOffset() * 60000 --> riporto la data  al fusorario locale
    // toISOString() -->  converte la data nel formato UTC 2025-03-11T15:00:00.000Z ( Z significa "Zulu Time", ovvero UTC+0 -> senza fusorario) e elimina il fusorario locale
    // .slice(0,16) --> prendo solamente 2025-03-11T15:00

    const dateObj = new Date(prenotazione.dataOraPrenotazione);
    const localDateTime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setSelectedPrenotazione({
      ...prenotazione,
      dataOraPrenotazione: localDateTime
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare questa prenotazione?")) return;

    fetch(`http://localhost:8080/prenotazioni/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella cancellazione della prenotazione");
        }
        return response;
      })
      .then(() => {
        setPrenotazioni((prev) => prev.filter((p) => p.prenotazioneId !== id));
        alert("Prenotazione eliminata con successo!");
      })
      .catch((err) => setError(err.message));
  };

  const handleEdit = () => {
    const payload = {
      dataOraPrenotazione: selectedPrenotazione.dataOraPrenotazione,
      servizioId: selectedPrenotazione.servizioId,
      utenteId: selectedPrenotazione.utenteId,
      indirizzoId: selectedPrenotazione.indirizzoId,
      note: selectedPrenotazione.note
    };

    console.log("Dati inviati:", payload);

    fetch(`http://localhost:8080/prenotazioni/update/${selectedPrenotazione.prenotazioneId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) {
          setShowModal(false);
          return response.json().then((data) => {
            throw new Error(data.message || "Errore nella modifica della prenotazione");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("✅ Prenotazione aggiornata con successo:", data);
        alert("Prenotazione aggiornata con successo!");
        setShowModal(false);
        window.location.reload();
      })
      .catch((err) => setError(err.message));
  };

  // Fetch per ottenere tutti gli indirizzi
  useEffect(() => {
    fetch("http://localhost:8080/indirizzi/all", {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nel recupero degli indirizzi");
        return response.json();
      })
      .then((data) => setIndirizzi(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  return (
    <Container className="my-5">
      {userRole == "ADMIN" || userRole == "PERSONAL_TRAINER" ? (
        <h2 className="text-center mb-3">Tutte le prenotazioni</h2>
      ) : (
        <h2 className="text-center mb-3">Le tue prenotazioni</h2>
      )}

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && prenotazioni.length === 0 && <Alert variant="warning">Nessuna prenotazione attiva.</Alert>}

      {!loading && prenotazioni.length > 0 && (
        <div className="table-responsive">
          <Table striped bordered hover responsive="sm" variant="dark" className="mt-5">
            <thead>
              <tr>
                <th>#</th>
                <th>Servizio</th>
                <th>Data</th>
                <th>Ora</th>
                <th>Indirizzo</th>
                <th>Note</th>
                {userRole === "ADMIN" || userRole === "PERSONAL_TRAINER" ? <th>Utente</th> : null}
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {prenotazioni.map((prenotazione, index) => (
                <tr key={prenotazione.prenotazioneId || index}>
                  <td>{index + 1}</td>
                  <td>{prenotazione.nomeServizio}</td>
                  <td>{new Date(prenotazione.dataOraPrenotazione).toLocaleDateString()}</td>
                  <td>{new Date(prenotazione.dataOraPrenotazione).toLocaleTimeString()}</td>
                  <td>{prenotazione.indirizzo}</td>
                  <td>{prenotazione.note || "Nessuna nota"}</td>
                  {userRole === "ADMIN" || userRole === "PERSONAL_TRAINER" ? (
                    <td>
                      {prenotazione.nomeUtente} {prenotazione.cognomeUtente}
                    </td>
                  ) : null}
                  <td>
                    <div className="d-flex justify-content-center align-item-center">
                      <TfiPencilAlt
                        className="icon-edit me-2 mt-1"
                        onClick={() => openEditModal(prenotazione)}
                        style={{ cursor: "pointer", color: "orange" }}
                      />
                      <FaTrashAlt
                        className="icon-delete ms-3 mt-1"
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleDelete(prenotazione.prenotazioneId)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {selectedPrenotazione && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton className="bg-dark text-light">
            <Modal.Title>Modifica Prenotazione</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            {/* ----- Data e Ora ------- */}
            <Form.Group>
              <Form.Label>Nuova Data e Ora</Form.Label>
              <Form.Control
                type="datetime-local"
                value={selectedPrenotazione.dataOraPrenotazione}
                onChange={(e) => setSelectedPrenotazione({ ...selectedPrenotazione, dataOraPrenotazione: e.target.value })}
              />
            </Form.Group>

            {/* ------ Modifica Servizio ------- */}
            <Form.Group className="mt-3">
              <Form.Label>Nuovo Servizio</Form.Label>
              <Form.Select
                value={selectedPrenotazione.servizioId}
                onChange={(e) => setSelectedPrenotazione({ ...selectedPrenotazione, servizioId: e.target.value })}
              >
                {servizi.map((servizio, index) => (
                  <option key={servizio.id || index} value={servizio.id}>
                    {servizio.nomeServizio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Nuovo Indirizzo</Form.Label>
              <Form.Select
                value={selectedPrenotazione.indirizzoId}
                onChange={(e) => setSelectedPrenotazione({ ...selectedPrenotazione, indirizzoId: parseInt(e.target.value) })}
              >
                {indirizzi.map((indirizzo, index) => (
                  <option key={indirizzo.id || index} value={indirizzo.id}>
                    {`${indirizzo.via} ${indirizzo.numeroCivico}, ${indirizzo.citta} (${indirizzo.provincia}) - ${indirizzo.nomeStudio}`}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* ----- Note ------*/}
            <Form.Group className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedPrenotazione.note}
                onChange={(e) => setSelectedPrenotazione({ ...selectedPrenotazione, note: e.target.value })}
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

export default PrenotazioniComponent;
