import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import NavbarComponent from "./Layout/NavbarComponent";

const HeroSection = () => {
  const scrollToSection = () => {
    const nextSection = document.getElementById("next-section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  const nomeUtente = localStorage.getItem("nomeUtente");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("jwtToken"));

  //controllo per vedere se l'utente è autenticato, se nel localStorage c'è il tokken o meno
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("jwtToken")); // !! converte il valore in booleano quindi se getItem trova un valore --> ritorna true altrimenti false
    };
    //quando il localStorage cambia viene chiamata la funzione, ma il cambiamento non deve provenire da questa pagina
    //con "storage" viene subito preso in considerazione un cambiamento nel local o session storage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Quando viene chiuso questo componente, viene pulito tutto quello che ha lasciato attivo
      //non viengono più ascoltati i cambiammenti nel localStorage
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="hero-section d-flex justify-content-center align-items-center text-center">
      <div className="hero-content text-white">
        <section className=" text-center d-flex flex-column justify-content-center align-items-center">
          {isAuthenticated ? <h2 className="my-4 display-3 fw-bold nome-utente font-Arvo">Bentornato {nomeUtente}</h2> : ""}
          {isAuthenticated ? (
            <h1 className="display-4 fw-bold mt-2">Migliora il tuo benessere!</h1>
          ) : (
            <h1 className="display-4 fw-bold mt-4">Migliora il tuo benessere!</h1>
          )}
          <p className="lead">Scopri un percorso personalizzato per migliorare la tua forma fisica con consulenze personalizzate e massaggi mirati.</p>
        </section>
        <Button variant="warning" className="btn-md mt-3 " onClick={scrollToSection}>
          Scopri di più
        </Button>
      </div>
    </header>
  );
};

export default HeroSection;
