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
  const [selectedIndirizzo, setSelectedIndirizzo] = useState({
    via: "",
    numeroCivico: "",
    citta: "",
    provincia: "",
    nomeStudio: "",
    latitudine: null,
    longitudine: null
  });

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
      .then((data) => setIndirizzi(data))
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
        setIndirizzi((prev) => prev.map((ind) => (ind.id === selectedIndirizzo.id ? data : ind)));
        setShowEditModal(false);
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
        setIndirizzi([...indirizzi, data]);
        setShowAddModal(false);
        setLuogo("");
        setLuogoTrovato("");
      })
      .catch((err) => setError(err.message));
  };

  // Eliminare un indirizzo
  const handleDelete = (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo indirizzo?")) return;
    fetch(`http://localhost:8080/indirizzi/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtToken}` }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Errore nella cancellazione dell'indirizzo");
        setIndirizzi(indirizzi.filter((ind) => ind.id !== id));
      })
      .catch((err) => setError(err.message));
  };

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

  return (
    <Container className="my-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mx-auto mb-4 mt-2">Gestione Indirizzi</h2>
        <div>
          <Button className="btn-primary" style={{ marginLeft: "-133px" }} onClick={openAddModal}>
            + Aggiungi Indirizzo
          </Button>
        </div>
      </div>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && indirizzi.length === 0 && <Alert variant="warning">Nessun indirizzo trovato.</Alert>}

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
              {/* <Form.Group className="mt-3">
                <Form.Label>Latitudine</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.latitudine}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, latitudine: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Longitudine</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedIndirizzo.longitudine}
                  onChange={(e) => setSelectedIndirizzo({ ...selectedIndirizzo, longitudine: e.target.value })}
                  required
                />
              </Form.Group> */}
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
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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
              {/* <Form.Group>
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
              </Form.Group> */}

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
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-light">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
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
