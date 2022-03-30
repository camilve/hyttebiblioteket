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
import "./Header.css";
import { arrowBackSharp, chevronBack } from "ionicons/icons";
import { useRouteMatch, useHistory } from "react-router-dom";

type HeaderProps = {
  title: string;
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
      <IonToolbar mode="md" id="navbar">
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
            {!back && <div id="logoHeader" />}
            {loading ? (
              <IonSkeletonText className="headerTitleSkeleton" />
            ) : (
              <p style={{ display: "inline" }}>{title}</p>
            )}
          </div>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
