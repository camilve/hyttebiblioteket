import React from "react";
import { IonGrid, IonRow } from "@ionic/react";
import registerImg from "../images/Bilde1.png";
import scrollImg from "../images/Bilde2.png";
import getImg from "../images/Bilde3.png";
import giveImg from "../images/Bilde4.png";
import "./how-to.css";

const HowTo = () => {
  return (
    <IonGrid className="content">
      <IonRow className="mt">
        <h2 className="title">Hvordan fungerer det?</h2>
      </IonRow>
      <IonRow className="flex">
        <img src={registerImg} className="img" alt="register image" />
        <h6 className="howTitle">1. Registrer</h6>
        <p className="img">Registrer deg som bruker for å komme i gang.</p>
      </IonRow>
      <IonRow className="flex">
        <img src={scrollImg} className="img" alt="find image" />
        <h6 className="howTitle">2. Finn bok</h6>
        <p className="img">Bla igjennom bøker i nærområdet ditt.</p>
      </IonRow>
      <IonRow className="flex">
        <img src={getImg} className="img" alt="get book image" />
        <h6 className="howTitle">3. Hent bok</h6>
        <p className="img">
          Finner du noe du vil lese? Ta turen ut, og registrer at du har hentet
          boka.
        </p>
      </IonRow>
      <IonRow className="flex">
        <img src={giveImg} className="img" alt="add book image" />
        <h6 className="howTitle">4. Legg ut bok</h6>
        <p className="img">Legg ut bøker du ønsker å dele med andre.</p>
      </IonRow>
    </IonGrid>
  );
};

export default HowTo;
