import React, { useEffect } from "react";
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
import { IonReactRouter } from "@ionic/react-router";
import { home, library, addCircle, location } from "ionicons/icons";
import MyBooks from "./pages/MyBooks";
import Books from "./pages/Books";
import Borrowed from "./pages/Borrowed";
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
    <IonRouterOutlet>
      <Switch>
        <Route path="/login" component={LoginScreen} exact />
        <Route path="/register" component={RegistrationScreen} exact />
        <Route path="/about" component={AboutScreen} exact />
        <Route>
          <Redirect to="/about" />
        </Route>
      </Switch>
    </IonRouterOutlet>
  </IonReactRouter>
);

const routes: BreadCrumbType = {
  "/books": {
    component: Books,
    header: "Finn bok",
    back: false,
  },
  "/books/:id-:title": {
    component: BookScreen,
    header: "",
    back: true,
  },
  "/borrowed": {
    component: Borrowed,
    header: "L??nte b??ker",
    back: false,
  },
  "/borrowed/:id": {
    component: RepublishBook,
    header: "L??nt bok",
    back: true,
  },
  "/my-books": {
    component: MyBooks,
    header: "Mine b??ker",
    back: false,
  },
  "/my-books/add": {
    component: AddBook,
    header: "Legg ut bok",
    back: true,
  },
  "/my-books/edit-:id": {
    component: EditBook,
    header: "Rediger bok",
    back: true,
  },
  "/my-books/:page?": {
    component: MyBooks,
    header: "Mine b??ker",
    back: false,
  },
  "/home": {
    component: Home,
    header: "Hyttebiblioteket",
    back: false,
  },
};

const PublicRoutes = () => (
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          {Object.keys(routes).map((path) => (
            <Route
              key={path}
              path={path}
              exact
              component={() => (
                <IonPage>
                  {path !== "/home" && (
                    <Header
                      title={routes[path].header}
                      key="header"
                      back={routes[path].back || false}
                    />
                  )}
                  {React.createElement(routes[path].component, {})}
                </IonPage>
              )}
            />
          ))}
          <Redirect to="/books" />
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="books" href="/books">
          <IonIcon icon={location} />
          <IonLabel color="dark">Finn bok</IonLabel>
        </IonTabButton>
        <IonTabButton tab="borrowed" href="/borrowed">
          <IonIcon icon={library} />
          <IonLabel color="dark">L??nte b??ker</IonLabel>
        </IonTabButton>
        <IonTabButton tab="my-books" href="/my-books">
          <IonIcon icon={addCircle} />
          <IonLabel color="dark">Lagt ut</IonLabel>
        </IonTabButton>
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel color="dark">Hjem</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
);

const App: React.FC = () => {
  const [u, loading] = useAuthState(auth);

  useEffect(() => {}, [u, loading]);

  return loading ? (
    <IonApp>
      <IonLoading isOpen={loading} />
    </IonApp>
  ) : (
    <IonApp>{u ? <PublicRoutes /> : <PrivateRoutes />}</IonApp>
  );
};

export default App;
