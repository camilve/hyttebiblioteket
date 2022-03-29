import React from "react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import registerImg from "../images/Bilde1.png";
import scrollImg from "../images/Bilde2.png";
import getImg from "../images/Bilde3.png";
import giveImg from "../images/Bilde4.png";
import "./how-to.css";

const HowTo = () => {
  return (
    <IonGrid className="howtocontent">
      <IonRow>
        <IonCol className="flex">
          <img src={registerImg} className="img" alt="Register" />
          <h6 className="howTitle">1. Registrer</h6>
          <p className="imgText">
            Registrer deg som bruker for å komme i gang.
          </p>
        </IonCol>
        <IonCol className="flex">
          <img src={scrollImg} className="img" alt="Find books" />
          <h6 className="howTitle">2. Finn bok</h6>
          <p className="imgText">Bla igjennom bøker i nærområdet ditt.</p>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol className="flex">
          <img src={getImg} className="img" alt="Collect book" />
          <h6 className="howTitle">3. Hent bok</h6>
          <p className="imgText">
            Finner du noe du vil lese? Ta turen ut, og registrer at du har
            hentet boka.
          </p>
        </IonCol>
        <IonCol className="flex">
          <img src={giveImg} className="img" alt="Add book" />
          <h6 className="howTitle">4. Legg ut bok</h6>
          <p className="imgText">Legg ut bøker du ønsker å dele med andre.</p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default HowTo;
