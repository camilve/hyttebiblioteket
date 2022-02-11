import React from "react";
import HowTo from "../../components/how-to";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import logo from "../../images/logo.svg";
import "./About.css";

const About: React.FC = () => (
  <IonPage>
    <IonContent fullscreen>
      <div className="containerHeaderAbout">
        <div className="logoContainer">
          <IonIcon src={logo} className="logo" />
        </div>
      </div>
      <div className="howtocontainer">
        <HowTo />
      </div>
    </IonContent>
  </IonPage>
);

export default About;
