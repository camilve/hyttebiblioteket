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
  IonTitle,
} from "@ionic/react";
import {
  close,
  informationCircle,
  logOutOutline,
  person,
} from "ionicons/icons";
import { UserType } from "../../types/generalTypes";
import "./Home.css";
import HowTo from "../../components/how-to";
import { logout, auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";

const Tab3: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState<UserType | undefined>(undefined);
  const [openModal, setOpenModal] = useState<boolean>(false);

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
            <IonIcon icon={informationCircle} color="primary" slot="start" />
            <IonLabel>Om</IonLabel>
          </IonItem>
        </IonCard>
        <IonCard button onClick={() => logout()} className="homecard">
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
        <IonContent>
          <HowTo />
        </IonContent>
      </IonModal>
    </IonContent>
  );
};

export default Tab3;
