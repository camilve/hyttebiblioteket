import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonLoading,
} from "@ionic/react";
import { onAuthStateChanged } from "firebase/auth";
import { IonReactRouter } from "@ionic/react-router";
import { home, library, list } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import LoginScreen from "./pages/LoginScreen";
import RegistrationScreen from "./pages/Registration";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { auth } from "./db/index";
import { useAuthState } from "react-firebase-hooks/auth";

setupIonicReact();

const PrivateRoutes = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/login" component={LoginScreen} exact />
      <Route path="/register" component={RegistrationScreen} exact />
      <Route>
        <Redirect to="/login" />
      </Route>
    </IonRouterOutlet>
  </IonReactRouter>
);

const PublicRoutes = () => (
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/books">
          <Tab1 />
        </Route>
        <Route exact path="/my-books">
          <Tab2 />
        </Route>
        <Route path="/home">
          <Tab3 />
        </Route>
        <Route>
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="books" href="/books">
          <IonIcon icon={library} />
          <IonLabel>Finn bok</IonLabel>
        </IonTabButton>
        <IonTabButton tab="my-books" href="/my-books">
          <IonIcon icon={list} />
          <IonLabel>Mine bøker</IonLabel>
        </IonTabButton>
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>Hjem</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
);

const App: React.FC = () => {
  const [u, loading] = useAuthState(auth);
  const [user, setUser] = useState<null | any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });

    return unsubscribe;
  }, [user]);

  return loading ? (
    <IonApp>
      <IonLoading isOpen={loading} />
    </IonApp>
  ) : (
    <IonApp>{u ? <PublicRoutes /> : <PrivateRoutes />}</IonApp>
  );
};

export default App;
