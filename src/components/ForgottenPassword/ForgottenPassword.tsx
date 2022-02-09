import React, { useState } from "react";
import {
  IonModal,
  IonButton,
  IonIcon,
  IonText,
  IonItem,
  IonInput,
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
      <div className="modalContent">
        <IonButton fill="clear" onClick={() => handleclose()}>
          <IonIcon icon={close} />
        </IonButton>
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
          ></IonInput>
        </IonItem>
        <IonButton color="primary" fill="solid" id="sendButton">
          Send e-post
        </IonButton>
      </div>
    </IonModal>
  );
};

export default ForgottenPassword;
