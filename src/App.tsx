import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
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
  IonPage,
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
import BookScreen from "./pages/Book";
import RepublishBook from "./pages/RepublishBook";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import Header from "./components/Header";
import { BreadCrumbType } from "./types/book";

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

const routes: BreadCrumbType = {
  "/books": {
    component: Books,
    header: () => "Finn bok",
    back: false,
  },
  "/books/:id-:title": {
    component: BookScreen,
    header: (match) => match.title || "",
    back: true,
  },
  "/my-books": {
    component: MyBooks,
    header: () => "Mine bøker",
    back: false,
  },
  "/my-books/republish-:id": {
    component: RepublishBook,
    header: () => "Legg ut bok på nytt",
    back: true,
  },
  "/my-books/add": {
    component: AddBook,
    header: () => "Legg ut bok",
    back: true,
  },
  "/my-books/edit-:id": {
    component: EditBook,
    header: () => "Rediger bok",
    back: true,
  },
  "/my-books/:page?": {
    component: MyBooks,
    header: () => "Mine bøker",
    back: false,
  },
  "/home": {
    component: Home,
    header: () => "Hyttebiblioteket",
    back: false,
  },
};

const PublicRoutes = () => (
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <IonPage>
          <Switch>
            {Object.keys(routes).map((path) => (
              <Route
                key={path}
                path={path}
                exact
                component={() => (
                  <Header
                    title={(params) => routes[path].header(params)}
                    key="header"
                    back={routes[path].back || false}
                  />
                )}
              />
            ))}
          </Switch>
          <Switch>
            {Object.keys(routes).map((path) => (
              <Route
                key={path}
                path={path}
                exact
                component={routes[path].component}
              />
            ))}
            <Redirect to="/home" />
            {/*     <Route exact path="/books" component={Books} />
            <Route exact path="/books/:id-:title" component={BookScreen} />
            <Route exact path="/my-books" component={MyBooks} />
            <Route exact path="/my-books/republish-:id" component={RepublishBook} />
            <Route exact path="/my-books/:page?" component={MyBooks} />
            <Route path="/home" component={Home} />
            <Redirect to="/home" /> */}
          </Switch>
        </IonPage>
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
