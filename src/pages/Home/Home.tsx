import React, { useState, useEffect } from "react";
import * as userDB from "../../db/repositories/users";
import {
  IonContent,
  IonSkeletonText,
  IonCard,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
} from "@ionic/react";
import {
  close,
  informationCircleOutline,
  logOutOutline,
  person,
  chatboxOutline,
  documentTextOutline,
  bugOutline,
} from "ionicons/icons";
import { UserType } from "../../types/generalTypes";
import "./Home.css";
import HowTo from "../../components/how-to";
import TermsModal from "../../components/TermsModal";
import { logout, auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { setSelectedTable } from "../../services/selectTable.actions";

interface FeedbackProps {
  open: boolean;
  text: string;
}

const Tab3: React.FC = () => {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<UserType | undefined>(undefined);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState<FeedbackProps>({
    open: false,
    text: "",
  });
  const [openTermsModal, setOpenTermsModal] = useState<boolean>(false);

  const fetchUser = async () => {
    if (user && !userInfo) {
      const _user = await userDB.byId(user.uid);
      setUserInfo(_user);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  return (
    <IonContent fullscreen color="secondary">
      <div id="profilerounddiv">
        <div id="profileRounding">
          {userInfo?.name.substring(0, 2).toUpperCase()}
        </div>
      </div>
      <div className="homecontent">
        <div className="homeContainer">
          {userInfo ? (
            <>
              <p style={{ fontSize: "1.2rem" }}>{userInfo?.name}</p>
              <IonLabel id="emailText">
                <IonIcon icon={person} style={{ marginRight: "0.5rem" }} />
                {userInfo?.email}
              </IonLabel>
            </>
          ) : (
            <IonSkeletonText animated style={{ width: "88%" }} />
          )}
        </div>
        <IonCard className="homecard" button onClick={() => setOpenModal(true)}>
          <IonItem className="homecarditem">
            <IonIcon
              icon={informationCircleOutline}
              color="primary"
              slot="start"
            />
            <IonLabel>Om</IonLabel>
          </IonItem>
        </IonCard>
        <IonCard
          className="homecard"
          button
          onClick={() => setOpenTermsModal(true)}
        >
          <IonItem className="homecarditem">
            <IonIcon icon={documentTextOutline} color="primary" slot="start" />
            <IonLabel>Vilkår og betingelser</IonLabel>
          </IonItem>
        </IonCard>
        <IonCard
          className="homecard"
          button
          onClick={() => setOpenFeedbackModal({ open: true, text: "feedback" })}
        >
          <IonItem className="homecarditem">
            <IonIcon icon={chatboxOutline} color="primary" slot="start" />
            <IonLabel>Gi tilbakemelding</IonLabel>
          </IonItem>
        </IonCard>
        <IonCard
          className="homecard"
          button
          onClick={() => setOpenFeedbackModal({ open: true, text: "error" })}
        >
          <IonItem className="homecarditem">
            <IonIcon icon={bugOutline} color="primary" slot="start" />
            <IonLabel>Rapporter feil</IonLabel>
          </IonItem>
        </IonCard>
        <IonCard
          button
          onClick={() => {
            dispatch(setSelectedTable("ABOUT", "0"));
            logout();
          }}
          className="homecard"
        >
          <IonItem className="homecarditem">
            <IonIcon icon={logOutOutline} color="primary" slot="start" />
            <IonLabel>Logg ut</IonLabel>
          </IonItem>
        </IonCard>
      </div>
      <IonModal
        isOpen={openModal}
        swipeToClose={true}
        onDidDismiss={() => setOpenModal(false)}
      >
        <IonContent>
          <IonHeader collapse="fade" id="headerModal">
            <IonToolbar mode="md" id="navbar">
              <IonButtons slot="end">
                <IonButton onClick={() => setOpenModal(false)}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
              <IonTitle id="headerTitle">
                <div id="titleContentHeader">
                  <p style={{ display: "inline" }}>Hvordan fungerer det</p>
                </div>
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          {/* <IonContent> */}
          <HowTo />
          {/* </IonContent> */}
        </IonContent>
      </IonModal>

      <IonModal
        isOpen={openFeedbackModal.open}
        //swipeToClose={true}
        onDidDismiss={() => setOpenFeedbackModal({ open: false, text: "" })}
        breakpoints={[0, 0.3]}
        initialBreakpoint={0.3}
      >
        <div id="feedbackContent">
          <IonText id="textColor">
            Send e-post til <i>kontakt.hyttebiblioteket@gmail.com</i>
            {openFeedbackModal.text === "error"
              ? " for å rapportere feilen. Husk å legge ved boktittel og posisjon hvis det gjelder en bok."
              : " for å gi din tilbakemelding."}
            <br />
            <br />
            Tusen takk 😃
          </IonText>
        </div>
      </IonModal>
      <TermsModal open={openTermsModal} setOpen={setOpenTermsModal} />
    </IonContent>
  );
};

export default Tab3;
