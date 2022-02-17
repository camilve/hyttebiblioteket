import React, { useState, useEffect } from "react";
import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { BookType, KeyBookObjectType } from "../../types/book";
import { useHistory } from "react-router-dom";
import { IonButton, IonIcon } from "@ionic/react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  Circle,
  ZoomControl,
} from "react-leaflet";
import { chevronForward } from "ionicons/icons";
import { distanceBetween } from "geofire-common";
import "./Map.css";

interface MapProps {
  position?: LatLng;
  center?: LatLng;
  books?: Array<BookType>;
  clickable?: boolean;
  zoom?: number;
  setPosition?: (pos: LatLng) => void;
  distanceCircle?: number | null;
  clickableBooks?: boolean;
}

const bookIcon: L.DivIcon = new L.DivIcon({
  className: "book-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

const Map = ({
  position = undefined,
  center,
  books = [],
  zoom = 15,
  clickable = false,
  setPosition = undefined,
  distanceCircle = null,
  clickableBooks = false,
}: MapProps) => {
  const history = useHistory();
  const [bookList, setBookList] = useState<KeyBookObjectType>({});
  const [pos, setPos] = useState(
    position || L.latLng(63.42996251068396, 10.39284789280902)
  );

  useEffect(() => {
    sortBooksInMap(zoom);
  }, []);

  function MyComponent() {
    useMapEvents({
      click(e) {
        console.log(e);
        setPos(e.latlng);
        setPosition && setPosition(e.latlng);
      },
    });
    return null;
  }

  function ZoomTracker() {
    const map = useMapEvents({
      zoom() {
        sortBooksInMap(map.getZoom());
      },
    });
    return null;
  }

  function sortBooksInMap(mapZoom: number) {
    const list: KeyBookObjectType = {};
    const metresPerPixel =
      (40075016.686 * Math.abs(Math.cos((pos.lat * Math.PI) / 180))) /
      Math.pow(2, mapZoom + 8);
    const distance = Math.floor(metresPerPixel * 10) / 1000;
    let bookCopy = books;
    books.map((book: BookType) => {
      const id = book.id;
      if (bookCopy.includes(book)) {
        const bookList: Array<BookType> = [];
        bookList.push(book);
        bookCopy.map((b: BookType) => {
          if (
            b.id !== book.id &&
            distanceBetween(
              [b.position.latitude, b.position.longitude],
              [book.position.latitude, book.position.longitude]
            ) < distance
          ) {
            bookList.push(b);
          }
        });
        list[id] = { books: bookList };
        bookCopy = bookCopy.filter(
          (b: BookType) =>
            b.id === book.id ||
            distanceBetween(
              [b.position.latitude, b.position.longitude],
              [book.position.latitude, book.position.longitude]
            ) >= distance
        );
      }
    });
    setBookList(list);
  }

  return (
    <div style={{ height: "100%" }}>
      <MapContainer
        center={center || position || pos}
        zoom={zoom}
        zoomControl={false}
      >
        {clickable && <MyComponent />}
        <ZoomTracker />
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker
            position={pos}
            icon={
              new L.DivIcon({
                className: "center-icon",
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                popupAnchor: [0, -8],
              })
            }
            interactive={false}
          />
        )}
        {distanceCircle && (
          <Circle
            center={pos}
            color="#5F8CC5"
            fillColor="#B2C8E4"
            radius={distanceCircle}
            interactive={false}
          />
        )}
        {Object.keys(bookList).map((key: string) => {
          const book: BookType = bookList[key].books[0];
          return (
            <Marker
              position={[book.position.latitude, book.position.longitude]}
              icon={
                bookList[key].books.length > 1
                  ? new L.DivIcon({
                      html: `<p>${bookList[key].books.length}</p>`,
                      iconSize: [30, 30],
                      iconAnchor: [15, 15],
                      popupAnchor: [0, -15],
                    })
                  : bookIcon
              }
              key={book.id}
            >
              {clickableBooks && (
                <Popup>
                  {bookList[key].books.map((b: BookType, index: number) => (
                    <div key={b.id}>
                      <p>{`${b.title} av ${b.author}`}</p>

                      <IonButton
                        fill="outline"
                        color="primary"
                        onClick={() =>
                          history.push(`/books/${b.id}-${b.title}`)
                        }
                      >
                        <IonIcon slot="end" icon={chevronForward} />
                        Se bok
                      </IonButton>
                      {index + 1 !== bookList[key].books.length && (
                        <p className="divider" />
                      )}
                    </div>
                  ))}
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
