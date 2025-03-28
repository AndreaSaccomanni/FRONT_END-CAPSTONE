# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 🏋️‍♂️ Gestione Appuntamenti Personal Trainer

Questo sito punta a migliorare la gestione degli appuntamenti di un personal trainer che offre determinati servizi.

## 👥 Accessi disponibili

- 👤 Utente
- 🧑‍💼 Admin
- 🧑‍🏫 Personal Trainer

## ✉️ Registrazione e Notifiche Email

Al momento della registrazione viene inviata una mail di benvenuto contenente:

- Informazioni sui servizi offerti
- Contatti del personal trainer

Le email vengono inviate anche per:

- ✅ Conferma prenotazione
- ✏️ Modifica prenotazione
- ❌ Cancellazione prenotazione

## 📅 Gestione Prenotazioni

🔐 Solo dopo aver effettuato registrazione e login, l’utente può:

- Creare una nuova prenotazione
- Modificarla o cancellarla
- Visualizzare tutte le proprie prenotazioni attive

🕒 Orari disponibili senza sovrapposizioni, calcolati automaticamente in base a:

- Giorno scelto
- Durata del servizio
- Appuntamenti esistenti

## 🛠️ Funzionalità Admin e Personal Trainer

- Visualizzare tutte le prenotazioni attive
- Modificare o cancellare qualsiasi prenotazione
- Creare prenotazioni per utenti già registrati
- Registrare un nuovo utente e creare una prenotazione per lui

🔍 Accesso a una sezione dedicata alla gestione degli utenti, con possibilità di:

- Visualizzare tutti i dati
- Modificare le informazioni
- Rimuovere un cliente dal database

## 📍 Pagina Indirizzi

L’utente può visualizzare:

- Tutti gli studi dove è possibile prenotare
- I giorni associati a ciascun indirizzo

🗺️ Cliccando sull’icona accanto al nome dello studio si apre una mappa Google Maps dinamica, con:

- Coordinate geografiche ottenute in automatico dall’indirizzo selezionato

🔧 Da admin o personal trainer:

- Gestione completa degli indirizzi (aggiunta, modifica, eliminazione)
- Ogni giorno della settimana (esclusa la domenica) può essere assegnato a un solo indirizzo

⚠️ Se tutti i giorni sono occupati, non è possibile aggiungere un nuovo indirizzo finché non si libera almeno un giorno.

📍 La ricerca degli indirizzi è collegata direttamente a Google Maps API: anche scrivendo solo il nome della palestra, viene suggerito automaticamente il primo risultato trovato su Google.

## 📄 Pagine Pubbliche

- 🕵️ Chi sono – informazioni sul personal trainer, percorso di studi e esperienze lavorative
- 💼 Servizi – card interattive con i servizi offerti e relative descrizioni

## Repository back-end:

https://github.com/AndreaSaccomanni/CAPSTONE.git
