import React, { useState, useEffect } from "react";
import * as userDB from "../db/repositories/users";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSkeletonText,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { UserType } from "../types/generalTypes";
import "./Tab3.css";
import HowTo from "../components/how-to";
import { logout, auth } from "../db/index";
import { useAuthState } from "react-firebase-hooks/auth";

const Tab3: React.FC = () => {
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    fetchUser();
  }, [user]);

  const fetchUser = async () => {
    if (user && !userInfo) {
      const _user = await userDB.byId(user.uid);
      setUserInfo(_user);
    }
  };

  console.log(user);
  return (
    <IonPage>
      <IonHeader collapse="fade">
        <IonToolbar>
          {/* <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons> */}
          <IonTitle id="headerTitle">Hjem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="content">
          {userInfo ? (
            <p>{`Logget inn som ${userInfo?.name}`}</p>
          ) : (
            <IonSkeletonText animated style={{ width: "88%" }} />
          )}
          <IonButton onClick={() => logout()}>Logg ut</IonButton>
        </div>
        <HowTo />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
