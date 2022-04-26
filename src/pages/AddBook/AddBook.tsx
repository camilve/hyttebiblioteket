import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import L, { LatLng } from "leaflet";
import AddEditBookForm from "../../components/AddEditBookForm";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { IonContent, IonSkeletonText } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";

const AddBook: React.FC = () => {
  const history = useHistory();
  const [user, loading] = useAuthState(auth);
  const [position, setPosition] = useState<LatLng | undefined>(undefined);
  const [posLoading, setPosLoading] = useState<boolean>(false);

  useEffect(() => {
    getLocation();
  }, []);

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

  return (
    <IonContent>
      <div className="content">
        {(posLoading || loading) && <IonSkeletonText />}
        {position && user && (
          <AddEditBookForm
            position={position}
            userId={user.uid}
            onSubmit={(val: any) => {
              bookDB
                .addBook(val)
                .then(() => {
                  history.push("/my-books");
                })
                .catch((e) => console.error(e));
            }}
            handleClose={() => history.push("/my-books")}
          />
        )}
      </div>
    </IonContent>
  );
};

export default AddBook;
