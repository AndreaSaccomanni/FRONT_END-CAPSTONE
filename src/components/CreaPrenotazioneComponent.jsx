import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
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
  const [showAlert, setShowAlert] = useState(false);
  const [indirizzi, setIndirizzi] = useState([]);
  const [selectedIndirizzo, setSelectedIndirizzo] = useState("");

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
      indirizzoId: selectedIndirizzo,
      note
    };

    //fetch per creare una nuova prenotazione
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
        setSelectedIndirizzo("");
        setNote("");
        navigate("/prenotazioni");
        alert("Prenotazione confermata✅");
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
      .catch((err) => setError(err.message));
  }, [jwtToken]);

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

              {showAlert && (
                <Alert variant="warning" className="alert alert-danger mt-5 text-center">
                  Prima di selezionare un orario, scegli una data
                </Alert>
              )}

              <Form onSubmit={handleCreaPrenotazione} className="mt-5">
                {/* Data */}
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona la Data</Form.Label>
                  <Form.Control type="date" value={dataSelezionata} onChange={(e) => setDataSelezionata(e.target.value)} required />
                </Form.Group>

                {/* servizi*/}
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona un Servizio</Form.Label>
                  <Form.Select defaultValue="" onChange={(e) => setSelectedServizio(e.target.value)} required>
                    <option value="" disabled>
                      Seleziona un servizio...
                    </option>
                    {servizi.map((servizio) => (
                      <option key={servizio.id} value={servizio.id}>
                        {servizio.nomeServizio} - Durata: {servizio.durata} minuti
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* indirizzi*/}
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona un indirizzo</Form.Label>
                  <Form.Select defaultValue="" onChange={(e) => setSelectedIndirizzo(e.target.value)} required>
                    <option value="" disabled>
                      Seleziona un indirizzo...
                    </option>
                    {indirizzi.map((indirizzo) => (
                      <option key={indirizzo.id} value={indirizzo.id}>
                        {`${indirizzo.via} ${indirizzo.numeroCivico}, ${indirizzo.citta} (${indirizzo.provincia})`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* orari disponibili */}
                <Form.Group className="mb-3">
                  <Form.Label>Orari Disponibili</Form.Label>
                  <Form.Select
                    className="form-select"
                    value={orarioSelezionato}
                    onChange={(e) => {
                      setOrarioSelezionato(e.target.value);
                      e.target.blur(); //chiude la select una volta selezionato l'orario
                    }}
                    required
                    onFocus={(e) => {
                      if (!dataSelezionata) {
                        setShowAlert(true);
                        setTimeout(() => setShowAlert(false), 5000); // Nasconde il messaggio dopo 3 secondi
                        e.target.blur(); // Impedisce l'apertura della select
                      } else {
                        e.target.size = 5; // Se la data è selezionata, mostra 5 opzioni
                      }
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

                {/* Note */}
                <Form.Group className="mb-3">
                  <Form.Label>Note</Form.Label>
                  <Form.Control as="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Inserisci eventuali note..." />
                </Form.Group>

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
