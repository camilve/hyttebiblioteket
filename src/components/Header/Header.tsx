import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonSkeletonText,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { MatchParams } from "../../types/book";
import { useRouteMatch } from "react-router-dom";

type HeaderProps = {
  title: (match: MatchParams) => string;
  back?: boolean;
  loading?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  title,
  back = false,
  loading = false,
}) => {
  const match = useRouteMatch();
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
            {loading ? (
              <IonSkeletonText className="headerTitleSkeleton" />
            ) : (
              <p style={{ display: "inline" }}>{title(match.params)}</p>
            )}
          </div>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
