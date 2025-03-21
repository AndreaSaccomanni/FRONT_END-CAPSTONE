import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TbMapSearch } from "react-icons/tb";

const IndirizzoComponent = () => {
  const [indirizzi, setIndirizzi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(null);
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMIN" || userRole === "PERSONAL_TRAINER";

  const jwtToken = localStorage.getItem("jwtToken");
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

  const toggleMap = (id) => {
    setShowMap((prev) => (prev === id ? null : id)); // toggle mappa visibile
  };

  return (
    <Container className="mt-4 text-center">
      <h2 className="text-center">Tutti gli studi</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="text-start mb-4">
        {isAdmin && (
          <Button as={Link} to="/gestioneIndirizzi" className="indirizzo-button">
            Gestisci Indirizzi
          </Button>
        )}
      </div>

      {!loading &&
        indirizzi.map((indirizzo) => (
          <div key={indirizzo.id} className="mb-5">
            <div className="d-flex align-items-center">
              <div>
                <h4 className="mb-2 text-start">{indirizzo.nomeStudio}</h4>
                <p className="mb-3 text-start">
                  {indirizzo.via} {indirizzo.numeroCivico}, {indirizzo.citta} ({indirizzo.provincia})
                </p>
              </div>
              <div className="display-1">
                <TbMapSearch className="mb-4 ms-5 icona-mappa" onClick={() => toggleMap(indirizzo.id)} />
              </div>
            </div>
            {showMap === indirizzo.id && (
              <div style={{ width: "100%", height: "400px" }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "10px" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${indirizzo.latitudine},${indirizzo.longitudine}&hl=it&z=15&t=k&output=embed`}
                  title={`Mappa ${indirizzo.nomeStudio}`}
                ></iframe>
              </div>
            )}
          </div>
        ))}
    </Container>
  );
};

export default IndirizzoComponent;
