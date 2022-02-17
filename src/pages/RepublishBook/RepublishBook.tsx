import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import * as userDB from "../../db/repositories/users";
import L, { LatLng } from "leaflet";
import { BookType } from "../../types/book";
import { UserType } from "../../types/generalTypes";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, RouteComponentProps } from "react-router-dom";
import { Formik, Form } from "formik";
import Map from "../../components/Map";
import { GeoPoint } from "firebase/firestore";
import { geohashForLocation } from "geofire-common";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonAlert,
  IonText,
  IonInput,
  IonItem,
  IonLabel,
  IonToggle,
  IonSkeletonText,
  IonTextarea,
} from "@ionic/react";
import { Geolocation } from "@ionic-native/geolocation";
import { trash, checkmark } from "ionicons/icons";
import "./RepublishBook.css";
import * as yup from "yup";

interface BookDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const RepublishBook: React.FC<BookDetailPageProps> = ({ match }) => {
  const history = useHistory();
  const { id } = match.params;
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [posLoading, setPosLoading] = useState<boolean>(false);
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
        history.push("/my-books");
        return;
      }
      fetchUser(_books);
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
            book && book.ownership && book.ownerId !== user.uid ? (
              <div key="content">
                <p key="owner">
                  <i>{`Boka tilhører ${owner?.name}`}</i>
                </p>
              </div>
            ) : (
              <div key="content" id="trashContainer">
                <IonButton
                  onClick={() => setDeleteAlert(true)}
                  key="btn"
                  fill="clear"
                >
                  <IonIcon slot="icon-only" icon={trash} />
                </IonButton>
                ,
                <IonAlert
                  key="alert"
                  isOpen={deleteAlert}
                  onDidDismiss={() => setDeleteAlert(false)}
                  header={"Slett bok"}
                  message={
                    book.ownership && book.ownerId !== user.uid
                      ? "Boka har eierskap og kan derfor ikke slettes."
                      : "Er du sikker på at du vil slette boka?"
                  }
                  buttons={
                    book.ownership && book.ownerId !== user.uid
                      ? [
                          {
                            text: "Lukk",
                            role: "cancel",
                            cssClass: "secondary",
                            id: "cancel-button",
                            handler: () => {
                              setDeleteAlert(false);
                            },
                          },
                        ]
                      : [
                          {
                            text: "Avbryt",
                            role: "cancel",
                            cssClass: "secondary",
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
                        ]
                  }
                />
              </div>
            ),

            <Formik
              key="formik"
              initialValues={{
                latitude: position?.lat,
                longitude: position?.lng,
                comment: "",
                geohash: book?.geohash || "",
                ownership: book?.ownership || false,
              }}
              validationSchema={yup.object().shape({
                comment: yup.string().required("Feltet er påkrevd"),
              })}
              onSubmit={(val) => {
                console.log(val);
                const values: BookType = {
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  position: new GeoPoint(
                    Number(val.latitude),
                    Number(val.longitude)
                  ),
                  userId: book.ownerId,
                  ownerId: book.ownership ? book.ownerId : book.borrowedBy,
                  published: book.published,
                  comment: val.comment,
                  geohash: geohashForLocation([
                    Number(val.latitude),
                    Number(val.longitude),
                  ]),
                  ownership: val.ownership,
                  borrowed: false,
                  borrowedBy: book.ownership ? book.borrowedBy : "",
                };
                bookDB
                  .updateBook(id, values)
                  .then(() => {
                    history.push("/my-books");
                  })
                  .catch((e) => console.error(e));
              }}
            >
              {({
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <Form>
                  <IonItem>
                    <IonLabel>Tittel: </IonLabel>
                    <IonInput value={book.title} disabled />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Forfatter: </IonLabel>
                    <IonInput value={book.author} disabled />
                  </IonItem>
                  <IonItem>
                    <IonLabel>Utgitt: </IonLabel>
                    <IonInput value={book.published} disabled />
                  </IonItem>
                  <p className="divider" />
                  <IonText color="primary">Her ligger boka</IonText>
                  <p className="infoText">
                    Klikk på kartet for å endre posisjon. Prøv å få punktet så
                    nøyaktig som mulig.
                  </p>
                  <div className="republishMapContainer">
                    <Map
                      position={position}
                      clickable
                      setPosition={(pos) => {
                        setFieldValue("latitude", pos.lat);
                        setFieldValue("longitude", pos.lng);
                        setPosition(pos);
                      }}
                    />
                  </div>
                  <IonText color="primary">Kommentar</IonText>
                  <p />
                  <IonItem
                    className={
                      !!errors.comment && touched.comment ? "error" : "noError"
                    }
                  >
                    <IonTextarea
                      name="comment"
                      onIonChange={(e: any) => {
                        handleChange(e);
                      }}
                      required
                      placeholder="Gi en beskrivelse hvor boka ligger."
                      onIonBlur={handleBlur}
                      value={values.comment}
                      rows={5}
                      autocapitalize="sentences"
                    />
                  </IonItem>
                  {!!errors.comment && touched.comment && (
                    <IonText color="danger">
                      <p className="caption">{errors.comment}</p>
                    </IonText>
                  )}
                  {book.ownerId === user.uid && [
                    <p className="divider" key="divider" />,
                    <IonItem key="toggle" id="toggleBorder">
                      <IonLabel color="primary">
                        Eierskap til boka
                        <p className="infoText" key="infotext">
                          Hvis du ønsker å se hvem som har boka til enhver tid,
                          slik at du lettere kan få den tilbake.
                        </p>
                      </IonLabel>
                      <IonToggle
                        checked={values.ownership}
                        onIonChange={(e) =>
                          setFieldValue("ownership", e.detail.checked)
                        }
                        name="ownership"
                      />
                    </IonItem>,
                  ]}
                  <IonButton expand="block" type="submit" color="primary">
                    <IonIcon slot="end" icon={checkmark} />
                    Legg ut boka på nytt
                  </IonButton>
                </Form>
              )}
            </Formik>,
          ]}
        {(bookLoading || posLoading || loading) && <IonSkeletonText />}
      </div>
    </IonContent>
  );
};

export default RepublishBook;
