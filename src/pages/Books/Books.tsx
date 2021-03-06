import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonToolbar,
  IonList,
  IonItem,
  IonSkeletonText,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  IonRange,
  IonCard,
  IonChip,
  IonLabel,
  isPlatform,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import L, { LatLng } from "leaflet";
import * as book from "../../db/repositories/books";
import { auth } from "../../db/index";
import { BookType } from "../../types/book";
import { LocationError } from "../../types/generalTypes";
import "./Books.css";
import { getLocationErrorMessage } from "../../help-functions/error";
import { getDistanceFromLatLonInKm } from "../../help-functions/distance";
import { Geolocation } from "@capacitor/geolocation";
import Map from "../../components/Map";
import { RefresherEventDetail } from "@ionic/core";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTable } from "../../services/selectTable.actions";

const Books: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const booksState = useSelector((state: any) => state.selectedTableBooks);
  const selectedTable = booksState.selectedTable || "0";
  const [books, setBooks] = useState<Array<BookType>>([]);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [posLoading, setPosLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(10);
  const [locationError, setLocationError] = useState<LocationError>({
    showError: false,
  });
  const [position, setPosition] = useState<LatLng | undefined>(undefined);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    getLocation();
  }, [user]);

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
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      if (pos) {
        const pos1: LatLng = L.latLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        setPosition(pos1);
        fetchBooks(pos1, distance);
        console.log(pos);
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
    <IonContent fullscreen>
      <IonToolbar className="toolbarSegment">
        <div id="rangeContainer">
          <div id="rangelabel">
            <IonLabel color="primary">
              <b>Avstand</b>
            </IonLabel>
            <IonLabel>{distance} km</IonLabel>
          </div>
          <IonItem id="rangeItem">
            <IonRange
              value={distance}
              max={25}
              min={1}
              onIonChange={(e) => {
                setDistance(e.detail.value as number);
                position && fetchBooks(position, e.detail.value as number);
              }}
            />
          </IonItem>
        </div>
      </IonToolbar>
      <IonToolbar className="toolbarSegment">
        <IonChip
          className="chip"
          color={selectedTable === "0" ? "primary" : undefined}
          onClick={() => dispatch(setSelectedTable("BOOKS", "0"))}
        >
          <IonLabel
            className="chipText"
            color={selectedTable === "0" ? "primary" : undefined}
          >
            Liste
          </IonLabel>
        </IonChip>

        <IonChip
          className="chip"
          color={selectedTable === "1" ? "primary" : undefined}
          onClick={() => dispatch(setSelectedTable("BOOKS", "1"))}
        >
          <IonLabel
            className="chipText"
            color={selectedTable === "1" ? "primary" : undefined}
          >
            Kart
          </IonLabel>
        </IonChip>
      </IonToolbar>
      {selectedTable === "0" && (
        <>
          <IonRefresher
            closeDuration="1ms"
            slot="fixed"
            onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
              getLocation();
              setTimeout(() => {
                event.detail.complete();
              }, 1);
            }}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {!posLoading &&
            !bookLoading && [
              books.length === 0 && (
                <IonItem key="noAvailable">
                  <IonLabel class="ion-text-wrap">
                    Ingen b??ker tilgjengelig
                    <p>{`${
                      !position
                        ? "Du m?? tillate posisjon for ?? finne b??ker."
                        : ""
                    }`}</p>
                  </IonLabel>
                </IonItem>
              ),
              books.map((book: BookType) => (
                <IonCard
                  key={book.id}
                  button
                  onClick={() =>
                    history.push(`/books/${book.id}-${book.title}`)
                  }
                >
                  <div className="bookCard">
                    <IonLabel>
                      <p>
                        {`${
                          position &&
                          getDistanceFromLatLonInKm(
                            position.lat,
                            position.lng,
                            book.position.latitude,
                            book.position.longitude
                          )
                        } km`}
                      </p>
                      <p id="bookTitle">{book.title}</p>
                      <p>{`Av ${book.author}`}</p>
                    </IonLabel>
                  </div>
                </IonCard>
              )),
            ]}
        </>
      )}
      {selectedTable === "1" &&
        !posLoading &&
        !bookLoading && [
          position && (
            <div
              className={
                isPlatform("ios")
                  ? "mapContainerBooksIos"
                  : "mapContainerBooksAndroid"
              }
              key="map"
            >
              <Map
                position={position}
                books={books}
                distanceCircle={distance * 1000}
                clickableBooks
              />
            </div>
          ),
          !position && (
            <IonList key="noPosition">
              <IonItem key="noAvailable">
                <IonLabel class="ion-text-wrap">
                  Ingen b??ker tilgjengelig
                  <p>{`${
                    !position ? "Du m?? tillate posisjon for ?? finne b??ker." : ""
                  }`}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          ),
        ]}
      {(posLoading || bookLoading || loading) && (
        <IonList>
          {Object.keys(Array(5).fill(0)).map((val) => (
            <IonItem key={`skel-${val}`}>
              <IonLabel>
                <IonSkeletonText animated style={{ width: "88%" }} />
                <p>
                  <IonSkeletonText animated style={{ width: "75%" }} />
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
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
  );
};

export default Books;
