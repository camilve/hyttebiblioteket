import React, { useState } from "react";
import * as bookDB from "../../db/repositories/books";
import { LatLng } from "leaflet";
import { BookType } from "../../types/book";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import Map from "../../components/Map";
import { GeoPoint } from "firebase/firestore";
import { geohashForLocation } from "geofire-common";
import {
  IonModal,
  IonButton,
  IonText,
  IonItem,
  IonLabel,
  IonToggle,
  IonTextarea,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
} from "@ionic/react";
import { close } from "ionicons/icons";
import "./RepublishBook.css";
import * as yup from "yup";

type BookDetailPageProps = {
  book: BookType;
  open: boolean;
  pos: LatLng;
  closemodal: () => void;
};

const RepublishBookModal: React.FC<BookDetailPageProps> = ({
  book,
  pos,
  open,
  closemodal,
}) => {
  const history = useHistory();
  const [user] = useAuthState(auth);
  const [position, setPosition] = useState<LatLng>(pos);

  return (
    <IonModal isOpen={open}>
      <IonHeader collapse="fade" id="headerModal">
        <IonToolbar mode="md" id="navbar">
          <IonButtons slot="end">
            <IonButton onClick={closemodal}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>

          <IonTitle id="headerTitle">
            <div id="titleContentHeader">
              <p style={{ display: "inline" }}>Legg ut bok på nytt</p>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      {book && user && position && (
        <div className="ionContentIsh">
          <Formik
            key="formik"
            initialValues={{
              latitude: position?.lat,
              longitude: position?.lng,
              geohash: book?.geohash || "",
              ownership: book?.ownership || false,
              comment: "",
            }}
            validationSchema={yup.object().shape({
              comment: yup.string().required("Feltet er påkrevd"),
            })}
            onSubmit={(val) => {
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
                borrowedDate: "",
                prevBorrowedId: "",
              };
              bookDB
                .updateBook(book.id, values)
                .then(() => {
                  closemodal();
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
                <div className="content">
                  <div>
                    <IonText  id="textColor">
                      <p>{`Tittel: ${book.title}`}</p>
                      <p className="bookInfo">
                        <strong>Forfatter:</strong> {book.author}
                      </p>
                      <p className="bookInfo">
                        <strong>Utgitt:</strong> {book.published}
                      </p>
                    </IonText>
                  </div>
                  <div className="whitebackgroundcontent">
                    <IonText color="primary">Her ligger boka</IonText>
                    <p className="infoText">
                      Klikk på kartet for å endre posisjon. Prøv å få punktet så
                      nøyaktig som mulig.
                    </p>
                    <div className="republishMapContainer">
                      {open && (
                        <Map
                          key="mapmodal"
                          position={position}
                          clickable
                          setPosition={(pos) => {
                            setFieldValue("latitude", pos.lat);
                            setFieldValue("longitude", pos.lng);
                            setPosition(pos);
                          }}
                          markerSelf
                        />
                      )}
                    </div>
                    <IonText color="primary">Kommentar</IonText>
                    <p />
                    <IonItem
                      className={
                        !!errors.comment && touched.comment
                          ? "error"
                          : "noError"
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
                  </div>

                  {book.ownerId === user.uid && (
                    <>
                      <br />
                      <div className="whitebackgroundcontent">
                        <IonItem key="toggle" id="toggleBorder">
                          <IonLabel color="primary">
                            Eierskap til boka
                            <p className="infoText" key="infotext">
                              Hvis du ønsker å se hvem som har boka til enhver
                              tid, slik at du lettere kan få den tilbake.
                            </p>
                          </IonLabel>
                          <IonToggle
                            checked={values.ownership}
                            onIonChange={(e) =>
                              setFieldValue("ownership", e.detail.checked)
                            }
                            name="ownership"
                          />
                        </IonItem>
                      </div>
                    </>
                  )}
                  <br />
                  <IonButton
                    expand="block"
                    type="submit"
                    color="primary"
                    className="btnModalAdd"
                  >
                    Legg ut
                  </IonButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </IonModal>
  );
};

export default RepublishBookModal;
