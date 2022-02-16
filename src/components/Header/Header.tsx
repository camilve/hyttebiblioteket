import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSkeletonText,
  isPlatform,
  IonIcon,
} from "@ionic/react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { arrowBackSharp, chevronBack } from "ionicons/icons";
import { MatchParams } from "../../types/book";
import { useRouteMatch, useHistory } from "react-router-dom";

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
  const history = useHistory();

  function handleClick() {
    const path = match.url.split("/");
    const s = path.slice(0, path.length - 1).join("/");
    history.replace(s);
  }

  return (
    <IonHeader collapse="fade" id="header">
      <IonToolbar color="primary" mode="md" id="navbar">
        {back && (
          <IonButtons slot="start">
            <IonButton onClick={handleClick}>
              <IonIcon
                icon={isPlatform("ios") ? chevronBack : arrowBackSharp}
              />
            </IonButton>
            {/* <IonBackButton defaultHref="/" /> */}
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
