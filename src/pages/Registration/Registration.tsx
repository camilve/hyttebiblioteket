import React, { useState } from "react";
import {
  IonPage,
  IonItem,
  IonContent,
  IonInput,
  IonText,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonIcon,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import HowTo from "../../components/how-to";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { registerWithEmailAndPassword } from "../../db/index";
import "./Registration.css";
import { getErrorMessage } from "../../help-functions/error";
import { useHistory } from "react-router-dom";

const Registration: React.FC = () => {
  const history = useHistory();
  const [errorRegister, setErrorRegister] = useState("");
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="containerRegister">
          <div className="logoContainer">
            <IonIcon src={logo} className="logo" />
          </div>
          <IonCard className="logincard">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonText>
              <h2 className="title">Registrer</h2>
            </IonText>
            <Formik
              initialValues={{
                email: "",
                name: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={yup.object().shape({
                name: yup.string().required("Feltet er påkrevd"),
                email: yup
                  .string()
                  .email("Ugyldig epost")
                  .required("Feltet er påkrevd"),
                password: yup
                  .string()
                  .min(6, "Passordet må ha minst 6 karakterer")
                  .required("Feltet er påkrevd"),
                confirmPassword: yup
                  .string()
                  .required("Feltet er påkrevd")
                  .when("password", {
                    is: (val: string) => (val && val.length > 0 ? true : false),
                    then: yup
                      .string()
                      .oneOf([yup.ref("password")], "Passordene er ikke like"),
                  }),
              })}
              onSubmit={(val) => {
                registerWithEmailAndPassword(
                  val.name,
                  val.email,
                  val.password
                ).then((res) => {
                  setErrorRegister(getErrorMessage(res));
                  if (res === "") {
                    history.push("/");
                  }
                });
              }}
            >
              {({
                handleChange,
                handleBlur,
                errors,
                touched,
                values,
                handleSubmit,
              }) => (
                <Form>
                  <IonItem
                    className={
                      !!errors.name && touched.name ? "error" : "noError"
                    }
                  >
                    <IonInput
                      name="name"
                      placeholder="Navn"
                      onIonChange={(e: any) => {
                        handleChange(e);
                        setErrorRegister("");
                      }}
                      required
                      type="text"
                      onIonBlur={handleBlur}
                    ></IonInput>
                  </IonItem>
                  {!!errors.name && touched.name && (
                    <IonText color="danger">
                      <p className="caption">{errors.name}</p>
                    </IonText>
                  )}
                  <IonItem
                    className={
                      !!errors.email && touched.email ? "error" : "noError"
                    }
                  >
                    <IonInput
                      name="email"
                      onIonChange={(e: any) => {
                        handleChange(e);
                        setErrorRegister("");
                      }}
                      required
                      type="email"
                      onIonBlur={handleBlur}
                      placeholder="E-post"
                    ></IonInput>
                  </IonItem>
                  {!!errors.email && touched.email && (
                    <IonText color="danger">
                      <p className="caption">{errors.email}</p>
                    </IonText>
                  )}
                  <IonItem
                    className={
                      !!errors.password && touched.password
                        ? "error"
                        : "noError"
                    }
                  >
                    <IonInput
                      placeholder="Passord"
                      name="password"
                      onIonChange={(e: any) => {
                        handleChange(e);
                        setErrorRegister("");
                      }}
                      required
                      type="password"
                      onIonBlur={handleBlur}
                    ></IonInput>
                  </IonItem>
                  {!!errors.password && touched.password && (
                    <IonText color="danger">
                      <p className="caption">{errors.password}</p>
                    </IonText>
                  )}
                  <IonItem
                    className={
                      !!errors.confirmPassword && touched.confirmPassword
                        ? "error"
                        : "noError"
                    }
                  >
                    <IonInput
                      name="confirmPassword"
                      placeholder="Gjenta passord"
                      onIonChange={(e: any) => {
                        handleChange(e);
                        setErrorRegister("");
                      }}
                      required
                      type="password"
                      onIonBlur={handleBlur}
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") {
                          if (values.email && values.password && values.name)
                            handleSubmit();
                        }
                      }}
                    ></IonInput>
                  </IonItem>
                  {!!errors.confirmPassword && touched.confirmPassword && (
                    <IonText color="danger">
                      <p className="caption">{errors.confirmPassword}</p>
                    </IonText>
                  )}
                  <IonButton
                    expand="block"
                    color="primary"
                    fill="solid"
                    onClick={() => handleSubmit()}
                  >
                    Registrer
                  </IonButton>
                  <IonText color="danger">
                    <p id="errorText" className="caption">
                      {errorRegister}
                    </p>
                  </IonText>
                </Form>
              )}
            </Formik>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registration;
