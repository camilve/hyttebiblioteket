import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import { auth } from "../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Tab3.css";
import HowTo from "../components/how-to";

const Tab3: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hyttebiblioteket</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <IonCard className="card">
            <IonButton color="secondary" fill="solid">
              Registrer
            </IonButton>
            <p className="orLoginText">Eller logg inn</p>
            <IonItem>
              <IonLabel position="floating" className="label">
                E-post
              </IonLabel>
              <IonInput
                value=""
                onIonChange={(e) => console.log("test")}
                required
                type="email"
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating" className="label">
                Passord
              </IonLabel>
              <IonInput
                value=""
                onIonChange={(e) => console.log("test")}
                required
                type="password"
              ></IonInput>
            </IonItem>
            <IonButton
              expand="block"
              color="primary"
              fill="solid"
              type="submit"
            >
              Logg inn
            </IonButton>
            <IonButton fill="clear" color="dark">
              Glemt passord
            </IonButton>
          </IonCard>
        </div>
        <HowTo />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
