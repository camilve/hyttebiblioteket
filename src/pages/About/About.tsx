import React from "react";
import HowTo from "../../components/how-to";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonSlides,
  IonSlide,
  IonRouterLink,
  IonText,
  IonButton,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import "./About.css";
import registerImg from "../../images/Bilde1.png";
import scrollImg from "../../images/Bilde2.png";
import getImg from "../../images/Bilde3.png";
import giveImg from "../../images/Bilde4.png";
import { useHistory } from "react-router-dom";

const slideOpts = {
  initialSlide: 0,
  speed: 400,
};

const About: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      {/*   <IonContent fullscreen>
      <div className="containerHeaderAbout">
        <div className="logoContainer">
          <IonIcon src={logo} className="logo" />
        </div>
      </div>
      <div className="howtocontainer">
        <HowTo />
      </div>
    </IonContent> */}
      <IonContent class="ion-padding">
        <IonSlides pager={true} options={slideOpts}>
          <IonSlide>
            <div className="slide">
              <img src={registerImg} alt="Register" />
              <h2>1. Registrer</h2>
              <p>Registrer deg som bruker for å komme i gang.</p>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <img src={scrollImg} alt="Find books" />
              <h2>2. Finn bok</h2>
              <p>Bla igjennom bøker i nærområdet ditt.</p>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <img src={getImg} alt="Collect book" />
              <h2>3. Hent bok</h2>
              <p>
                Finner du noe du vil lese? Ta turen ut, og registrer at du har
                hentet boka.
              </p>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="slide">
              <img src={giveImg} alt="Collect book" />
              <h2>4. Legg ut bok</h2>
              <p>Legg ut bøker du ønsker å dele med andre.</p>
            </div>
          </IonSlide>
        </IonSlides>
        <div className="regLoginCon">
          <IonButton
            expand="block"
            color="primary"
            fill="solid"
            className="regBtn"
            onClick={() => history.push("/register")}
          >
            Registrer
          </IonButton>
          <IonText>
            Har du allerede bruker?
            <IonRouterLink onClick={() => history.push("/login")}>
              {" "}
              Logg inn her
            </IonRouterLink>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default About;
