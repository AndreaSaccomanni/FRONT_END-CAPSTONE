import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const CreaPrenotazioneComponent = () => {
  const [servizi, setServizi] = useState([]);
  const [orariDisponibili, setOrariDisponibili] = useState([]); // Lista di orari disponibili
  const [dataSelezionata, setDataSelezionata] = useState("");
  const [orarioSelezionato, setOrarioSelezionato] = useState("");
  const [selectedServizio, setSelectedServizio] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [errorToken, setErrorToken] = useState("");

  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("jwtToken");

  // Fetch per ottenere i servizi disponibili
  useEffect(() => {
    if (!jwtToken) {
      setErrorToken("Per effettuare una prenotazione è necessario fare il ");
      return;
    }
    fetch("http://localhost:8080/servizi/all", {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then((response) => response.json())
      .then((data) => setServizi(data))
      .catch((error) => console.error("Errore:", error));
  }, [jwtToken]);

  // Fetch per ottenere gli orari disponibili in base alla data e al servizio selezionati
  useEffect(() => {
    if (dataSelezionata && selectedServizio) {
      fetch(`http://localhost:8080/prenotazioni/orariDisponibili?data=${dataSelezionata}&servizioId=${selectedServizio}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
        .then((response) => response.json())
        .then((data) => setOrariDisponibili(data))
        .catch((error) => console.error("Errore:", error));
    }
  }, [dataSelezionata, jwtToken, selectedServizio]);

  const handleCreaPrenotazione = (e) => {
    e.preventDefault();

    if (!orarioSelezionato) {
      setError("Seleziona un orario disponibile.");
      return;
    }

    const dataOraPrenotazione = `${dataSelezionata}T${orarioSelezionato}:00`; // Formato ISO

    const prenotazioneDTO = {
      servizioId: selectedServizio,
      dataOraPrenotazione,
      note
    };

    fetch("http://localhost:8080/prenotazioni/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(prenotazioneDTO)
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Errore durante la creazione della prenotazione");
          });
        }
        return response.json();
      })
      .then(() => {
        setDataSelezionata("");
        setOrarioSelezionato("");
        setSelectedServizio("");
        setNote("");
        navigate("/prenotazioni");
        alert("Prenotazione confermata✅");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mt-5">Crea una nuova prenotazione</h2>
          {errorToken ? (
            <div className="alert alert-danger mt-5">
              {errorToken}{" "}
              <Link to="/login" className="link-rosso text-red fw-bold">
                login
              </Link>{" "}
              o{" "}
              <Link to="/registrazione" className="link-rosso fw-bold">
                registrarsi
              </Link>
              .
            </div>
          ) : (
            <>
              {error && (
                <div className="alert alert-danger mt-5" style={{ whiteSpace: "pre-line" }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleCreaPrenotazione} className="mt-5">
                {/* Selezione della Data */}
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona la Data</Form.Label>
                  <Form.Control type="date" value={dataSelezionata} onChange={(e) => setDataSelezionata(e.target.value)} required />
                </Form.Group>

                {/* Selezione del Servizio */}
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona un Servizio</Form.Label>
                  <Form.Select defaultValue="" onChange={(e) => setSelectedServizio(e.target.value)} required>
                    <option value="" disabled>
                      Seleziona un servizio...
                    </option>
                    {servizi.map((servizio) => (
                      <option key={servizio.id} value={servizio.id}>
                        {servizio.nomeServizio}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Selezione dell'Orario disponibile */}
                <Form.Group className="mb-3">
                  <Form.Label>Orari Disponibili</Form.Label>
                  <Form.Select
                    className="form-select"
                    value={orarioSelezionato}
                    onChange={(e) => {
                      setOrarioSelezionato(e.target.value);
                      setTimeout(() => {
                        e.target.blur(); // Forza la chiusura immediata
                      }, 80); // Ritardo di 100ms per una chiusura più fluida
                    }}
                    required
                    disabled={!orariDisponibili.length}
                    onFocus={(e) => {
                      e.target.size = 5; // Mostra 8 opzioni quando aperta
                    }}
                    onBlur={(e) => {
                      e.target.size = 1; // Torna a mostrare solo 1 opzione quando chiusa
                    }}
                  >
                    <option value="">Seleziona un orario...</option>
                    {orariDisponibili.map((orario, index) => (
                      <option key={index} value={orario.split("T")[1].slice(0, 5)}>
                        {orario.split("T")[1].slice(0, 5)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Inserimento Note */}
                <Form.Group className="mb-3">
                  <Form.Label>Note</Form.Label>
                  <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Inserisci eventuali note..." />
                </Form.Group>

                {/* Bottone di invio */}
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary" type="submit">
                    Crea Prenotazione
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreaPrenotazioneComponent;
