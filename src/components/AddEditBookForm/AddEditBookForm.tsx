import React, { useState } from "react";
import { Formik, Form } from "formik";
import { LatLng } from "leaflet";
import Input from "../Input";
import Map from "../Map";
import * as yup from "yup";
import { GeoPoint } from "firebase/firestore";
import { geohashForLocation } from "geofire-common";
import { BookType } from "../../types/book";
import {
  IonButton,
  IonText,
  IonItem,
  IonToggle,
  IonLabel,
  IonTextarea,
} from "@ionic/react";

type AddEditProps = {
  edit?: boolean;
  borrowed?: boolean;
  book?: BookType;
  userId: string;
  position: LatLng;
  onSubmit: (val: any) => void;
  handleClose: () => void;
};

const AddEditBookForm = ({
  edit = false,
  borrowed = false,
  book = undefined,
  userId,
  position: pos,
  onSubmit,
  handleClose,
}: AddEditProps) => {
  const [position, setPosition] = useState<LatLng | undefined>(pos);

  return (
    <Formik
      initialValues={{
        title: book?.title || "",
        author: book?.author || "",
        published: book?.published || "",
        latitude: book?.position.latitude || position?.lat,
        longitude: book?.position.longitude || position?.lng,
        comment: book?.comment || "",
        ownerId: book?.ownerId || userId,
        geohash: book?.geohash || "",
        ownership: book?.ownership || false,
        borrowed: book?.borrowed || false,
        borrowedBy: book?.borrowedBy || "",
        borrowedDate: book?.borrowedDate || "",
      }}
      validationSchema={yup.object().shape({
        title: yup.string().required("Feltet er påkrevd"),
        author: yup.string().required("Feltet er påkrevd"),
        published: yup.string().required("Feltet er påkrevd"),
        comment: yup.string().required("Feltet er påkrevd"),
      })}
      onSubmit={(val) => {
        const values = {
          title: val.title,
          author: val.author,
          position: new GeoPoint(Number(val.latitude), Number(val.longitude)),
          userId: val.ownerId,
          ownerId: val.ownerId,
          published: val.published,
          comment: val.comment,
          geohash: geohashForLocation([
            Number(val.latitude),
            Number(val.longitude),
          ]),
          ownership: val.ownership,
          borrowed: val.borrowed,
          borrowedBy: val.borrowedBy,
          borrowedDate: val.borrowedDate,
        };
        onSubmit(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        errors,
        touched,
        setFieldValue,
        values,
      }) => {
        return (
          <Form>
            <div className="whitebackgroundcontent">
              <Input
                name="title"
                label="Tittel"
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                required
                values={values}
                disabled={borrowed}
              />
              <Input
                name="author"
                label="Forfatter"
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                required
                values={values}
                disabled={borrowed}
                autocapitalize="words"
              />
              <Input
                name="published"
                label="Utgitt (år)"
                handleBlur={handleBlur}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                required
                values={values}
                disabled={borrowed}
                // className="lastInput"
                type="number"
              />
            </div>
            <br />
            <div className="whitebackgroundcontent">
              <IonText color="primary">Her ligger boka</IonText>
              <p className="infoText">
                Klikk på kartet for å endre posisjon. Prøv å få punktet så
                nøyaktig som mulig.
              </p>

              <div className="republishMapContainer">
                <Map
                  position={position}
                  clickable={!borrowed}
                  markerSelf
                  setPosition={(pos) => {
                    setFieldValue("latitude", pos.lat);
                    setFieldValue("longitude", pos.lng);
                    setPosition(pos);
                  }}
                />
              </div>
              <IonText color="primary">Kommentar</IonText>
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
                  disabled={borrowed}
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
            {values.ownerId === userId && (
              <>
                <br />
                <div className="whitebackgroundcontent">
                  <p className="divider" />
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
                  </IonItem>
                </div>
              </>
            )}
            <br />
            <IonButton
              type="submit"
              expand="block"
              fill="solid"
              color="primary"
              className="btn"
            >
              {edit ? "Lagre" : "Legg ut"}
            </IonButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEditBookForm;
