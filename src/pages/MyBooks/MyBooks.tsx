import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Header from "../../components/Header";
import "./MyBooks.css";

const MyBooks: React.FC = () => {
  return (
    <IonPage>
      <Header title="Mine bøker" />
      <IonContent fullscreen>
        {/* <ExploreContainer name="Tab 1 page" /> */}
      </IonContent>
    </IonPage>
  );
};

export default MyBooks;
