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
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { close } from "ionicons/icons";
import Input from "../../components/Input";
import { registerWithEmailAndPassword } from "../../db/index";
import "./Registration.css";
import { getErrorMessage } from "../../help-functions/error";
import { useHistory } from "react-router-dom";

const Registration: React.FC = () => {
  const history = useHistory();
  const [errorRegister, setErrorRegister] = useState("");
  return (
    <IonPage>
      <IonHeader collapse="fade" id="headerModal">
        <IonToolbar mode="md" id="navbar" color="primary">
          <IonButtons slot="end">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="containerRegister">
          {/*  <div className="logoContainer">
            <IonIcon src={logo} className="logo" />
          </div> */}
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
                  <Input
                    name="name"
                    placeholder="Navn"
                    handleChange={(e: any) => {
                      handleChange(e);
                    }}
                    required
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    values={values}
                    autocapitalize="words"
                  />
                  <Input
                    name="email"
                    placeholder="E-post"
                    handleChange={(e: any) => {
                      handleChange(e);
                      setErrorRegister("");
                    }}
                    required
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    values={values}
                    type="email"
                    autocapitalize="none"
                  />
                  <Input
                    handleChange={(e: any) => {
                      handleChange(e);
                      setErrorRegister("");
                    }}
                    required
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    values={values}
                    placeholder="Passord"
                    name="password"
                    type="password"
                  />
                  <Input
                    name="confirmPassword"
                    placeholder="Gjenta passord"
                    handleChange={(e: any) => {
                      handleChange(e);
                      setErrorRegister("");
                    }}
                    errors={errors}
                    touched={touched}
                    values={values}
                    required
                    type="password"
                    handleBlur={handleBlur}
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") {
                        if (values.email && values.password && values.name)
                          handleSubmit();
                      }
                    }}
                  />
                  <IonButton
                    expand="block"
                    color="primary"
                    fill="solid"
                    className="btn"
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
