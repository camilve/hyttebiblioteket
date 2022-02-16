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
  IonIcon,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";

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
            <Input
              name="title"
              label="Tittel"
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              required
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
              disabled={borrowed}
            />
            <Input
              name="published"
              label="Utgitt (år)"
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              required
              disabled={borrowed}
            />
            <p className="divider" />
            <IonText color="primary">Her ligger boka</IonText>
            <p className="infoText">
              Klikk på kartet for å endre posisjon. Prøv å få punktet så
              nøyaktig som mulig.
            </p>
            <div className="republishMapContainer">
              <Map
                position={position}
                clickable={!borrowed}
                setPosition={(pos) => {
                  setFieldValue("latitude", pos.lat);
                  setFieldValue("longitude", pos.lng);
                  setPosition(pos);
                }}
              />
            </div>
            <IonText color="primary">Kommentar</IonText>
            <Input
              name="comment"
              placeholder="Gi en beskrivelse hvor boka ligger."
              handleBlur={handleBlur}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              required
              disabled={borrowed}
            />
            {values.ownerId === userId && (
              <>
                <p className="divider" />
                <IonItem key="toggle" id="toggleBorder">
                  <IonLabel color="primary">
                    Eierskap til boka
                    <p className="infoText" key="infotext">
                      Hvis du ønsker å se hvem som har boka til enhver tid, slik
                      at du lettere kan få den tilbake.
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
              </>
            )}
            <IonButton
              type="submit"
              expand="block"
              fill="solid"
              color="primary"
            >
              <IonIcon slot="end" icon={checkmark} />
              {edit ? "Rediger" : "Legg ut"}
            </IonButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEditBookForm;
