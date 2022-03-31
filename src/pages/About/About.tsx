import React from "react";
import {
  IonContent,
  IonPage,
  IonRouterLink,
  IonText,
  IonButton,
} from "@ionic/react";
import "./About.css";
import registerImg from "../../images/Bilde1.png";
import scrollImg from "../../images/Bilde2.png";
import getImg from "../../images/Bilde3.png";
import giveImg from "../../images/Bilde4.png";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "@ionic/react/css/ionic-swiper.css";
import "swiper/css/pagination";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedTable } from "../../services/selectTable.actions";
import { Pagination } from "swiper";

const About: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const aboutState = useSelector((state: any) => state.selectedAbout);
  const selectedTable = Number(aboutState.selectedTable) || 0;

  return (
    <IonPage>
      <IonContent class="ion-padding">
        <Swiper
          modules={[Pagination]}
          initialSlide={selectedTable}
          speed={400}
          slidesPerView={1}
          onSlideChange={(e) =>
            dispatch(setSelectedTable("ABOUT", String(e.activeIndex)))
          }
          onSwiper={(swiper) => console.log(swiper)}
          pagination
        >
          <SwiperSlide>
            <div className="slide">
              <img src={registerImg} alt="Register" />
              <h2>1. Registrer</h2>
              <p>Registrer deg som bruker for å komme i gang.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <img src={scrollImg} alt="Find books" />
              <h2>2. Finn bok</h2>
              <p>Bla igjennom bøker i nærområdet ditt.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <img src={getImg} alt="Collect book" />
              <h2>3. Hent bok</h2>
              <p>
                Finner du noe du vil lese? Ta turen ut, og registrer at du har
                hentet boka.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <img src={giveImg} alt="Collect book" />
              <h2>4. Legg ut bok</h2>
              <p>Legg ut bøker du ønsker å dele med andre.</p>
            </div>
          </SwiperSlide>
        </Swiper>
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
