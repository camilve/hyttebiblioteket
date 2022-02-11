import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import "./Header.css";

type HeaderProps = {
  title: string;
  back?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, back = false }) => {
  return (
    <IonHeader collapse="fade" id="header">
      <IonToolbar color="primary" mode="md" id="navbar">
        {back && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
        )}
        <IonTitle id="headerTitle">
          <div id="titleContentHeader">
            {!back && <img src={logo} alt="Logo" id="logoHeader" />}
            <p style={{ display: "inline" }}>{title}</p>
          </div>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
