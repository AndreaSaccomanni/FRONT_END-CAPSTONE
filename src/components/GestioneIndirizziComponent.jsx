import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";

const GestioneIndirizziComponent = () => {
  const [indirizzi, setIndirizzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const giorniSettimana = ["LUNEDI", "MARTEDI", "MERCOLEDI", "GIOVEDI", "VENERDI", "SABATO"];
  const [giorniAssegnati, setGiorniAssegnati] = useState([]);
  const [erroreNoGiorniDisponibili, setErroreNoGiorniDisponibili] = useState("");

  const [selectedIndirizzo, setSelectedIndirizzo] = useState({
    via: "",
    numeroCivico: "",
    citta: "",
    provincia: "",
    nomeStudio: "",
    latitudine: null,
    longitudine: null,
    giorniDisponibili: []
  });

  const resetSelectedIndirizzo = () => {
    setSelectedIndirizzo({
      via: "",
      numeroCivico: "",
      citta: "",
      provincia: "",
      nomeStudio: "",
      latitudine: null,
      longitudine: null,
      giorniDisponibili: []
    });
  };

  const jwtToken = localStorage.getItem("jwtToken");
  const [luogo, setLuogo] = useState(null);
  const [luogoTrovato, setLuogoTrovato] = useState(null);

  // Fetch per ottenere tutti gli indirizzi
  useEffect(() => {
    fetch("http://localhost:8080/indirizzi/all", {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nel recupero degli indirizzi");
        return response.json();
      })
      .then((data) => {
        setIndirizzi(data);
        //ricavo un array che contiene tutti i giorni occupati di ogni indirizzo -> ogni indirizzo avrebbe un array di giorni assegnati
        //con flatMap --> unisco più array in un unico array --> ricavo tutti gli array che contengono i giorni di ogni indirizzo (indirizzo.giorniDisponibili)
        // e li unisco tutti in un unico array che conterrà quindi tutti i giorni occpuati
        const giorniOccupati = data.flatMap((indirizzo) => indirizzo.giorniDisponibili || []);
        setGiorniAssegnati(giorniOccupati);
      })

      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jwtToken]);

  // modale per modifica
  const openEditModal = (indirizzo) => {
    setSelectedIndirizzo({ ...indirizzo });
    setShowEditModal(true);
  };

  //modale per aggiunta
  const openAddModal = () => {
    resetSelectedIndirizzo();
    setLuogo("");
    setLuogoTrovato("");
    setShowAddModal(true);
  };

  // modifica dell'indirizzo
  const handleEdit = () => {
    fetch(`http://localhost:8080/indirizzi/update/${selectedIndirizzo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwtToken}` },
      body: JSON.stringify(selectedIndirizzo)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nella modifica dell'indirizzo");
        return response.json();
      })
      .then((data) => {
        //per modificare solamente quello selezionato --> mappa tra tutti gli indirizzi e trova corrispondenza con l'id
        setIndirizzi((indirizziAttuali) => indirizziAttuali.map((indirizzo) => (indirizzo.id === selectedIndirizzo.id ? data : indirizzo)));
        setShowEditModal(false);

        const nuoviGiorniOccpuatiDopoModifica = [...indirizzi.map((indirizzo) => (indirizzo.id === data.id ? data : indirizzo))].flatMap(
          (indirizzo) => indirizzo.giorniDisponibili || []
        );
        setGiorniAssegnati(nuoviGiorniOccpuatiDopoModifica);
      })
      .catch((err) => setError(err.message));
  };

  // nuovo indirizzo
  const handleAdd = () => {
    fetch("http://localhost:8080/indirizzi/new", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwtToken}` },
      body: JSON.stringify(selectedIndirizzo)
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nell'aggiunta dell'indirizzo");
        return response.json();
      })
      .then((data) => {
        //aggiungo il nuovo indirizzo alla lista degli indirizzi
        const nuovaListaIndirizzi = [...indirizzi, data];
        setIndirizzi(nuovaListaIndirizzi);
        setShowAddModal(false);
        setLuogo("");
        setLuogoTrovato("");
        const nuoviGiorniAssegnatiDopoAggiunta = nuovaListaIndirizzi.flatMap((indirizzo) => indirizzo.giorniDisponibili || []);
        setGiorniAssegnati(nuoviGiorniAssegnatiDopoAggiunta);
      })
      .catch((err) => setError(err.message));
  };

  // Eliminare un indirizzo
  const handleDelete = (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo indirizzo?")) return;

    // controllo per vedere se ci sono prenotazioni collegate
    fetch(`http://localhost:8080/prenotazioni/indirizzo/${id}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel controllo prenotazioni collegate");
        return res.json();
      })
      .then((prenotazioni) => {
        if (prenotazioni.length > 0) {
          // aleert per conferma di eliminazione se ci sono prenotazioni collegate all'indirizzo
          const conferma = window.confirm("Ci sono prenotazioni per quell'indirizzo. Eliminare comunque?\nTutte le prenotazioni andranno perse.");
          if (!conferma) return;
        }

        //cancellazione indirizzo
        return fetch(`http://localhost:8080/indirizzi/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
      })
      .then((res) => {
        if (res && !res.ok) throw new Error("Errore nella cancellazione dell'indirizzo");

        // Rimozione indirizzo da lista indirizzi e rimozione dei giorni dell'indirizzo eliminato da quelli assegnato --> giorni di nuovo disponibili se elimino indirizzo
        setIndirizzi((indirizziAttuali) => {
          const nuovaLista = indirizziAttuali.filter((ind) => ind.id !== id);

          const nuoviGiorniAssegnati = nuovaLista.flatMap((ind) => ind.giorniDisponibili || []);
          setGiorniAssegnati(nuoviGiorniAssegnati);

          return nuovaLista;
        });
      })
      .catch((err) => setError(err.message));
  };

  //funzione per cercare indirizzi tramite google
  const searchPlace = () => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      query: luogo,
      fields: ["formatted_address", "geometry", "place_id"]
    };
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === "OK" && results.length > 0) {
        console.log(status);
        setLuogoTrovato(results[0].formatted_address);
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        selectedIndirizzo.latitudine = lat;
        selectedIndirizzo.longitudine = lng;

        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat, lng };

        geocoder.geocode({ location: latlng }, (res, geoStatus) => {
          if (geoStatus === "OK" && res.length > 0) {
            const components = res[0].address_components;

            const getComp = (type, useShort = false) => components.find((c) => c.types.includes(type))?.[useShort ? "short_name" : "long_name"] || "";

            // Popola i dati separati
            selectedIndirizzo.via = getComp("route");
            selectedIndirizzo.numeroCivico = getComp("street_number");
            selectedIndirizzo.citta = getComp("locality") || getComp("postal_town") || getComp("administrative_area_level_3");
            selectedIndirizzo.provincia = getComp("administrative_area_level_2", true);
          }
        });
      }
    });
  };

  const toggleGiornoDisponibile = (giornoCliccato) => {
    //ricavo i giorni disponbili per prendere appuntamento dell'indirizzo selezionato
    const giorniDisponibili = selectedIndirizzo.giorniDisponibili || [];
    //se nei giorni disponibili è presente il giorno che ho selezionato ,
    const giorniAggiornati = giorniDisponibili.includes(giornoCliccato)
      ? giorniDisponibili.filter((g) => g !== giornoCliccato) //lo rimuovo perchè era gia checkato
      : [...giorniDisponibili, giornoCliccato]; // se invece non è presente tra i giorni disponibili dell'indirizzo , lo aggiungo
    //aggiorno l'indirizzo selezionato con i nuovi giornni disponibili
    setSelectedIndirizzo({ ...selectedIndirizzo, giorniDisponibili: giorniAggiornati });
  };

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mx-auto mb-4 mt-2">Gestione Indirizzi</h2>
        <div>
          <Button
            className="btn-primary"
            style={{ marginLeft: "-133px" }}
            onClick={() => {
              if (giorniAssegnati.length === 6) {
                setErroreNoGiorniDisponibili(
                  "Non ci sono giorni liberi. Prima di aggiungere un nuovo indirizzo, rimuovi un giorno da uno degli indirizzi esistenti."
                );
                setTimeout(() => setErroreNoGiorniDisponibili(""), 5000); // nasconde l'errore dopo 5 sec
              } else {
                openAddModal();
              }
            }}
          >
            + Aggiungi Indirizzo
          </Button>
        </div>
      </div>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && indirizzi.length === 0 && <Alert variant="warning">Nessun indirizzo trovato.</Alert>}
      {erroreNoGiorniDisponibili && <Alert variant="danger">{erroreNoGiorniDisponibili}</Alert>}
      {!loading && indirizzi.length > 0 && (
        <div className="table-responsive">
          <Table striped bordered hover responsive="sm" variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Via</th>
                <th>Numero Civico</th>
                <th>Città</th>
                <th>Provincia</th>
                <th>Nome Studio</th>
                <th>Giorni Disponibili</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {indirizzi.map((indirizzo, index) => (
                <tr key={indirizzo.id || index}>
                  <td>{index + 1}</td>
                  <td>{indirizzo.via}</td>
                  <td>{indirizzo.numeroCivico}</td>
                  <td>{indirizzo.citta}</td>
                  <td>{indirizzo.provincia}</td>
                  <td>{indirizzo.nomeStudio}</td>
                  <td>{indirizzo.giorniDisponibili?.join(" - ") || "Nessun giorno assegnato"}</td>

                  <td className="d-flex justify-content-center align-item-center">
                    <TfiPencilAlt className="icon-edit me-2 mt-1" style={{ cursor: "pointer", color: "orange" }} onClick={() => openEditModal(indirizzo)} />
                    <FaTrashAlt className="icon-delete ms-3 mt-1" style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(indirizzo.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modale per modificare indirizzo */}
      {showEditModal && selectedIndirizzo && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton className="bg-dark text-light">
            <Modal.Title>Modifica Indirizzo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <Form>
              <Form.Group>
                <Form.Label>Via</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.via}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, via: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Numero civico</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.numeroCivico}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, numeroCivico: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Città</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.citta}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, citta: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Provincia</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.provincia}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, provincia: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Nome Studio</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.nomeStudio}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, nomeStudio: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Giorni disponibili</Form.Label>
                {giorniSettimana.map((giorno) => {
                  //per disabilitare i giorni che non sono assegnati all'indirizzo selezionato, e che sono gia assegnati a un altro indirizzo
                  const giaAssegnato = giorniAssegnati.includes(giorno) && !selectedIndirizzo.giorniDisponibili.includes(giorno);

                  return (
                    <Form.Check
                      key={giorno}
                      type="checkbox"
                      label={giorno}
                      value={giorno}
                      disabled={giaAssegnato}
                      checked={selectedIndirizzo.giorniDisponibili.includes(giorno)}
                      onChange={() => toggleGiornoDisponibile(giorno)}
                    />
                  );
                })}
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Modifica luogo</Form.Label>
                <Form.Control
                  type="text"
                  id="input-indirizzo"
                  name="indirizzo"
                  placeholder="Inserisci il nuovo luogo"
                  value={luogo || ""}
                  onChange={(e) => {
                    setLuogo(e.target.value);
                    searchPlace(e);
                  }}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Control type="text" id="indirizzo-trovato" name="indirizzoTrovato" disabled value={luogoTrovato || ""} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-light">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                resetSelectedIndirizzo();
              }}
            >
              Chiudi
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Salva Modifiche
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modale per aggiungere indirizzo */}
      {showAddModal && (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton className="bg-dark text-light">
            <Modal.Title>Aggiungi Indirizzo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <Form>
              <Form.Group className="mt-3">
                <Form.Label>Inserisci luogo</Form.Label>
                <Form.Control
                  type="text"
                  id="input-indirizzo"
                  name="indirizzo"
                  placeholder="Inserisci un luogo"
                  value={luogo || ""}
                  onChange={(e) => {
                    console.log(luogo);

                    setLuogo(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    searchPlace(e);
                  }}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Control type="text" id="indirizzo-trovato" name="indirizzoTrovato" disabled value={luogoTrovato || ""} />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Nome Studio</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.nomeStudio}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, nomeStudio: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Giorni disponibili</Form.Label>
                {giorniSettimana.map((giorno) => (
                  <Form.Check
                    key={giorno}
                    type="checkbox"
                    label={giorno}
                    value={giorno}
                    disabled={giorniAssegnati.includes(giorno)}
                    checked={selectedIndirizzo.giorniDisponibili.includes(giorno)}
                    onChange={() => toggleGiornoDisponibile(giorno)}
                  />
                ))}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-light">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetSelectedIndirizzo();
              }}
            >
              Chiudi
            </Button>
            <Button variant="primary" onClick={handleAdd}>
              Aggiungi
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default GestioneIndirizziComponent;
