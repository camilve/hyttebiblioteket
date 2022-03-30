import React, { useState } from "react";
import {
  IonModal,
  IonButton,
  IonIcon,
  IonText,
  IonItem,
  IonInput,
  IonHeader,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "./ForgottenPassword.css";

interface ForgottenPassordProps {
  open: boolean;
  handleclose: () => void;
  onSubmit: (email: string) => void;
}

export const ForgottenPassword: React.FC<ForgottenPassordProps> = ({
  open,
  handleclose,
  onSubmit,
}) => {
  const [email, setEmail] = useState<string>("");
  return (
    <IonModal isOpen={open}>
      <IonHeader collapse="fade" id="headerModal">
        <IonToolbar mode="md" id="navbar">
          <IonButtons slot="end">
            <IonButton onClick={() => handleclose()}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <div className="modalContent">
        <IonText>
          <h2 className="title">Glemt passord</h2>
        </IonText>
        <IonText>
          <p id="infotext">
            Skriv inn din registerte e-post, så sender vi deg videre
            instruksjoner.
          </p>
        </IonText>
        <IonItem>
          <IonInput
            name="email"
            onIonChange={(e: any) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="E-post"
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") {
                onSubmit(email);
              }
            }}
          ></IonInput>
        </IonItem>
        <IonButton
          color="primary"
          fill="solid"
          id="sendButton"
          onClick={() => onSubmit(email)}
        >
          Send e-post
        </IonButton>
      </div>
    </IonModal>
  );
};

export default ForgottenPassword;
