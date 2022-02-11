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
import {
  home,
  library,
  list,
  logIn,
  personAdd,
  informationCircle,
} from "ionicons/icons";
import MyBooks from "./pages/MyBooks";
import Books from "./pages/Books";
import Home from "./pages/Home";
import LoginScreen from "./pages/LoginScreen";
import RegistrationScreen from "./pages/Registration";
import AboutScreen from "./pages/About";

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
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/login" component={LoginScreen} exact />
        <Route path="/register" component={RegistrationScreen} exact />
        <Route path="/about" component={AboutScreen} exact />
        <Route>
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="login" href="/login">
          <IonIcon icon={logIn} />
          <IonLabel>Logg inn</IonLabel>
        </IonTabButton>
        <IonTabButton tab="register" href="/register">
          <IonIcon icon={personAdd} />
          <IonLabel>Registrer</IonLabel>
        </IonTabButton>
        <IonTabButton tab="about" href="/about">
          <IonIcon icon={informationCircle} />
          <IonLabel>Om</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
);

const PublicRoutes = () => (
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/books">
          <Books />
        </Route>
        <Route exact path="/my-books">
          <MyBooks />
        </Route>
        <Route path="/home">
          <Home />
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
