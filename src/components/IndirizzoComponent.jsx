import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const IndirizzoComponent = () => {
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "ADMIN" || userRole === "PERSONAL_TRAINER";

  const latitudine = "42.7099507"; // Latitudine
  const longitudine = "12.2836982"; // Longitudine

  return (
    <Container className="mt-4 text-center">
      <div className="d-flex align-items-center justify-content-between">
        <div className="mx-auto">
          <h3>Indirizzo Principale 📍</h3>
          <p>Via Madonna del Prato 5, Baschi</p>
        </div>

        {isAdmin && (
          <Button as={Link} to="/gestioneIndirizzi" className="indirizzo-button">
            Gestisci Indirizzi
          </Button>
        )}
      </div>

      <div className="my-3 " style={{ width: "100%", height: "500px" }}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: "10px" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${latitudine},${longitudine}&hl=it&z=15&t=k&output=embed`}
        ></iframe>
      </div>
    </Container>
  );
};

export default IndirizzoComponent;
