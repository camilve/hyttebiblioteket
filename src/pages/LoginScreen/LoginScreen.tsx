import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonCard,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonToast,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import "./LoginScreen.css";
import HowTo from "../../components/how-to";
import { signInEmailAndPassword, sendPasswordReset } from "../../db/index";
import { useHistory } from "react-router-dom";
import ForgottenPassword from "../../components/ForgottenPassword";

const LoginScreen: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signInError, setSignInError] = useState<boolean>(false);
  const [forgottenPassword, setForgottenPassword] = useState<boolean>(false);
  const [forgottenPasswordError, setForgottenPasswordError] =
    useState<boolean>(false);
  const [forgottenPasswordSent, setForgottenPasswordSent] =
    useState<boolean>(false);

  function signIn() {
    signInEmailAndPassword(email, password)
      .then(() => setSignInError(false))
      .catch((e) => {
        console.error(e);
        setSignInError(true);
      });
  }

  function resetPassword(email: string) {
    if (email) {
      sendPasswordReset(email)
        .then(() => {
          setForgottenPasswordSent(true);
          setForgottenPassword(false);
        })
        .catch((err) => {
          console.error(err);
          setForgottenPasswordError(true);
        });
    }
  }

  const handleKeypress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (email && password) signIn();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="containerLogin">
          <div className="logoContainer">
            <IonIcon src={logo} className="logo" />
          </div>
          <IonCard className="logincard">
            <IonButton
              color="secondary"
              fill="solid"
              onClick={() => history.push("/register")}
            >
              Registrer
            </IonButton>
            <p className="orLoginText">Eller logg inn</p>
            <IonItem>
              <IonLabel position="floating" className="label">
                E-post
              </IonLabel>
              <IonInput
                value={email}
                autocomplete="off"
                onIonChange={(e: any) => setEmail(e.target.value)}
                required
                type="email"
                onKeyPress={(e) => handleKeypress(e)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating" className="label">
                Passord
              </IonLabel>
              <IonInput
                value={password}
                onIonChange={(e: any) => setPassword(e.target.value)}
                required
                type="password"
                onKeyPress={(e) => handleKeypress(e)}
              ></IonInput>
            </IonItem>
            <IonButton
              expand="block"
              color="primary"
              fill="solid"
              onClick={() => {
                if (email && password) signIn();
              }}
            >
              Logg inn
            </IonButton>
            <IonText color="danger">
              <p id="caption">{signInError && "Feil e-post eller passord"}</p>
            </IonText>
            <IonButton
              fill="clear"
              color="dark"
              onClick={() => setForgottenPassword(true)}
            >
              Glemt passord
            </IonButton>
          </IonCard>
        </div>
        {/* <HowTo /> */}
        <ForgottenPassword
          open={forgottenPassword}
          onSubmit={(email: string) => resetPassword(email)}
          handleclose={() => setForgottenPassword(false)}
        />
        <IonToast
          isOpen={forgottenPasswordSent}
          onDidDismiss={() => setForgottenPasswordSent(false)}
          message="E-post er sendt."
          duration={6000}
          color="success"
        />
        <IonToast
          isOpen={forgottenPasswordError}
          onDidDismiss={() => setForgottenPasswordError(false)}
          message="Feil under sending av e-post"
          duration={6000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
