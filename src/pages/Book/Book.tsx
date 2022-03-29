import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonText,
  IonToast,
  IonSkeletonText,
  IonButton,
  IonCard,
} from "@ionic/react";
import L, { LatLng } from "leaflet";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import * as bookDB from "../../db/repositories/books";
import { auth } from "../../db/index";
import { BookType } from "../../types/book";
import "./Book.css";
import Map from "../../components/Map";
import { getLocationErrorMessage } from "../../help-functions/error";
import { getDistanceFromLatLonInKm } from "../../help-functions/distance";
import { Geolocation } from "@ionic-native/geolocation";
import { RouteComponentProps } from "react-router-dom";
import { LocationError } from "../../types/generalTypes";
import { useDispatch } from "react-redux";
import { setSelectedTable } from "../../services/selectTable.actions";

interface BookDetailPageProps
  extends RouteComponentProps<{
    id: string;
    title: string;
  }> {
  back: boolean;
}

const Book: React.FC<BookDetailPageProps> = ({ match }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = match.params;
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [bookLoading, setBookLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [posLoading, setPosLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<LocationError>({
    showError: false,
  });
  const [position, setPosition] = useState<LatLng | undefined>(undefined);

  useEffect(() => {
    fetchBook();
    getLocation();
  }, []);

  const fetchBook = async () => {
    if (user) {
      setBookLoading(true);
      setBook(undefined);
      const _books = await bookDB.byId(id);
      if (!_books) {
        history.push("/books");
        return;
      }
      if (
        _books.borrowed ||
        _books.borrowedBy === user.uid ||
        _books.ownerId === user.uid
      ) {
        history.push("/books");
        return;
      }
      setBook(_books);
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
        setPosition(pos1);
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
      <div className="bookContainer">
        {book && position && (
          <>
            <IonText color="tertiary">
              <p className="bookTitle">{book.title}</p>
            </IonText>
            <div className="card">
              <IonText>
                <p className="bookInfo">
                  <strong>Forfatter:</strong> {book.author}
                </p>
                <p className="bookInfo">
                  <strong>Utgitt:</strong> {book.published}
                </p>
              </IonText>
            </div>
            <br />
            <div className="card">
              <IonText color="primary">Lokasjon</IonText>
              <div className="mapContainerBook">
                <Map
                  position={position}
                  center={L.latLng(
                    book.position.latitude,
                    book.position.longitude
                  )}
                  zoom={
                    position &&
                    getDistanceFromLatLonInKm(
                      position.lat,
                      position.lng,
                      book.position.latitude,
                      book.position.longitude
                    ) < 10
                      ? 13
                      : 10
                  }
                  books={[book]}
                />
              </div>
              <br />
              <IonText>
                <p className="bookInfo" style={{ marginBottom: 0 }}>
                  <strong>Kommentar:</strong>
                </p>
                <p className="bookInfo" style={{ marginTop: 0 }}>
                  {book.comment}
                </p>
              </IonText>
            </div>
            <br />
            {user && (
              <IonButton
                color="primary"
                expand="block"
                fill="solid"
                className="btn"
                onClick={() => {
                  const newBook: BookType = book;
                  newBook.borrowedBy = user.uid;
                  newBook.borrowed = true;
                  if (!book.ownership) {
                    newBook.ownerId = user.uid;
                  }
                  newBook.borrowedDate = new Date().toString();
                  bookDB
                    .updateBook(id, newBook)
                    .then(() => {
                      dispatch(setSelectedTable("MY_BOOKS", "1"));
                      history.push("/my-books");
                    })
                    .catch((e) => console.error(e));
                }}
              >
                Registrer som lånt
              </IonButton>
            )}
          </>
        )}
        {(bookLoading || posLoading || loading) && (
          <>
            <IonText color="tertiary">
              <p>
                <IonSkeletonText animated style={{ width: "88%" }} />
              </p>
            </IonText>
            <IonText>
              <p>
                <IonSkeletonText animated style={{ width: "70%" }} />
              </p>
              <p>
                <IonSkeletonText animated style={{ width: "70%" }} />
              </p>
              <p>
                <IonSkeletonText animated style={{ width: "70%" }} />
              </p>
            </IonText>
          </>
        )}
        <IonToast
          isOpen={locationError.showError}
          message={locationError.message}
          onDidDismiss={() =>
            setLocationError({ showError: false, message: undefined })
          }
          duration={4000}
        />
      </div>
    </IonContent>
  );
};

export default Book;
