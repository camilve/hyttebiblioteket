import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonToolbar,
  IonList,
  IonItem,
  IonSkeletonText,
  IonToast,
} from "@ionic/react";
import { useAuthState } from "react-firebase-hooks/auth";
import L, { LatLng } from "leaflet";
import * as book from "../../db/repositories/books";
import { auth } from "../../db/index";
import { BookType } from "../../types/book";
import "./Books.css";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import Header from "../../components/Header";
import { getLocationErrorMessage } from "../../help-functions/error";
import { Geolocation } from "@ionic-native/geolocation";
import Map from "../../components/Map";

interface LocationError {
  showError: boolean;
  message?: string;
}

const Books: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState("0");
  const [books, setBooks] = useState<Array<BookType>>([]);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [posLoading, setPosLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(10);
  const [locationError, setLocationError] = useState<LocationError>({
    showError: false,
  });
  const [position, setPosition] = useState<LatLng | undefined>(undefined);
  const geo = navigator.geolocation;
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    getLocation();
  }, [geo, user]);

  const fetchBooks = async (pos: LatLng, dis: number) => {
    if (pos && user) {
      setBookLoading(true);
      setBooks([]);
      const _books = await book.allInRadius(
        [pos?.lat, pos?.lng],
        dis * 1000,
        user.uid
      );
      setBooks(_books);
      setBookLoading(false);
    }
  };

  const getLocation = async () => {
    setPosLoading(true);
    try {
      const pos = await Geolocation.getCurrentPosition();
      if (pos) {
        const pos1: LatLng = L.latLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log(pos1);
        setPosition(pos1);
        fetchBooks(pos1, distance);
      }
      setPosLoading(false);
    } catch (e: any) {
      setLocationError({
        showError: true,
        message: getLocationErrorMessage(e.code),
      });
      setPosLoading(false);
    }
  };

  return (
    <IonPage>
      <Header title="Finn bok" />
      <IonContent fullscreen>
        <IonToolbar color="primary" className="toolbarSegment">
          <IonSegment
            onIonChange={(e: any) => setSelectedTable(e.detail.value)}
            className="segment"
            value={selectedTable}
            mode="ios"
          >
            <IonSegmentButton className="segmentButton" value="0">
              <IonLabel>Liste</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton className="segmentButton" value="1">
              <IonLabel>Kart</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        {selectedTable === "0" && (
          <IonList>
            {!posLoading &&
              !bookLoading && [
                books.length === 0 && (
                  <IonItem key="noAvailable">
                    <IonLabel class="ion-text-wrap">
                      Ingen tilgjengelige
                      <p>{`${
                        !position
                          ? "Du må tillate posisjon for å finne bøker."
                          : ""
                      }`}</p>
                    </IonLabel>
                  </IonItem>
                ),
                books.map((book: BookType) => (
                  <IonItem
                    key={book.id}
                    button
                    onClick={() => console.log("test")}
                  >
                    <IonLabel>{book.title}</IonLabel>
                    <p>{`Av ${book.author}`}</p>
                  </IonItem>
                )),
              ]}
            {(posLoading || bookLoading) && (
              <IonItem>
                <IonSkeletonText animated style={{ width: "88%" }} />
              </IonItem>
            )}
          </IonList>
        )}
        {selectedTable === "1" && !posLoading && !bookLoading && position && (
          <div className="mapContainerBooks">
            <Map
              height="30rem"
              position={position}
              books={books}
              distanceCircle={distance * 1000}
            />
          </div>
        )}
        <IonToast
          isOpen={locationError.showError}
          message={locationError.message}
          onDidDismiss={() =>
            setLocationError({ showError: false, message: undefined })
          }
          duration={4000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Books;
