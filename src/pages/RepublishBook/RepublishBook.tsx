import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import * as userDB from "../../db/repositories/users";
import L, { LatLng } from "leaflet";
import { BookType } from "../../types/book";
import { UserType } from "../../types/generalTypes";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, useRouteMatch } from "react-router-dom";
import Map from "../../components/Map";
import Modal from "./RepublishBookModal";
import {
  IonContent,
  IonButton,
  IonAlert,
  IonText,
  IonSkeletonText,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import "./RepublishBook.css";

interface BookDetailPageProps {
  id: string;
}

const RepublishBook: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch<BookDetailPageProps>();
  const { id } = match.params;
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [posLoading, setPosLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [user, loading] = useAuthState(auth);
  const [owner, setOwner] = useState<UserType | undefined>(undefined);
  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng | undefined>(undefined);

  useEffect(() => {
    getLocation();
    fetchBook();
  }, [user]);

  const fetchBook = async () => {
    if (user) {
      setBookLoading(true);
      setBook(undefined);
      const _books = await bookDB.byId(id);
      if (!_books) {
        history.push("/borrowed");
        return;
      }
      if (_books.borrowed === false || _books.borrowedBy !== user.uid) {
        history.push("/borrowed");
        return;
      }
      fetchUser(_books);
      setBook(_books);
      setPosition(
        L.latLng(_books.position.latitude, _books.position.longitude)
      );
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
      setPosition(L.latLng(63.42996251068396, 10.39284789280902));
      setPosLoading(false);
    }
  };

  const fetchUser = async (_book: BookType) => {
    if (_book && _book.ownerId && _book.ownership) {
      const _user = await userDB.byId(_book.ownerId);
      setOwner(_user);
    }
  };

  return (
    <IonContent fullscreen>
      <div className="content">
        {book &&
          user &&
          position && [
            <div key="bookinfo">
              <IonText color="primary">
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
                {book && book.ownership && book.ownerId !== user.uid && (
                  <p className="bookInfo">
                    <i>{`Boka tilhører ${owner?.name}`}</i>
                  </p>
                )}
              </div>
              <br />
              <div className="card">
                <IonText color="primary">Lokasjon</IonText>
                <div className="mapContainerBook">
                  <Map
                    position={position}
                    key="mapPublish"
                    center={L.latLng(
                      book.position.latitude,
                      book.position.longitude
                    )}
                    books={[book]}
                  />
                </div>
                <br />
                <IonText>
                  <p className="bookInfo" style={{ marginBottom: "0.5rem" }}>
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
                    setOpenModal(true);
                  }}
                >
                  Legg ut bok på nytt
                </IonButton>
              )}
            </div>,
            <Modal
              closemodal={() => setOpenModal(false)}
              open={openModal}
              key="modal"
              book={book}
              pos={position}
            />,
            !(book && book.ownership && book.ownerId !== user.uid) && (
              <IonButton
                onClick={() => setDeleteAlert(true)}
                key="btn"
                fill="clear"
                className="deletebtn"
              >
                Slett
              </IonButton>
            ),
            <IonAlert
              key="alert"
              isOpen={deleteAlert}
              onDidDismiss={() => setDeleteAlert(false)}
              header={"Slett bok"}
              message={"Er du sikker på at du vil slette boka?"}
              buttons={[
                {
                  text: "Avbryt",
                  role: "cancel",
                  id: "cancel-button",
                  handler: () => {
                    setDeleteAlert(false);
                  },
                },
                {
                  text: "Slett",
                  id: "delete-button",
                  handler: () => {
                    bookDB
                      .deleteBook(book.id)
                      .then(() => history.push("/my-books/1"));
                  },
                },
              ]}
            />,
          ]}
        {(bookLoading || posLoading || loading) && <IonSkeletonText />}
      </div>
    </IonContent>
  );
};

export default RepublishBook;
