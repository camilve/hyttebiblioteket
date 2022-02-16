import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonPage,
  IonLabel,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import Header from "../../components/Header";
import "./MyBooks.css";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { BookType } from "../../types/book";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";

interface BookDetailPageProps
  extends RouteComponentProps<{
    page: string;
  }> {}

const MyBooks: React.FC<BookDetailPageProps> = ({ match }) => {
  const { page } = match.params;
  const history = useHistory();
  const [user, loading] = useAuthState(auth);
  const [selectedTable, setSelectedTable] = useState(page || "0");
  const [books, setBooks] = useState<Array<BookType>>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Array<BookType>>([]);
  const [booksLoading, setBooksLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBooks();
    if (!loading && !user) history.push("/");
  }, [user]);

  const fetchBooks = async () => {
    if (user) {
      setBooksLoading(true);
      setBooks([]);
      setBorrowedBooks([]);
      const _books = await bookDB.myBooks(user.uid);
      const _borrowedBooks = await bookDB.myBorrowedBooks(user.uid);
      setBooks(_books);
      setBorrowedBooks(_borrowedBooks);
      setBooksLoading(false);
    }
  };

  return (
    <IonContent fullscreen>
      <IonToolbar color="primary" className="toolbarSegment">
        <IonSegment
          onIonChange={(e: any) => {
            setSelectedTable(e.detail.value);
            history.push(`/my-books/${e.detail.value}`);
          }}
          className="segment"
          value={selectedTable}
          mode="ios"
        >
          <IonSegmentButton className="segmentButton" value="0">
            <IonLabel>Lagt ut</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton className="segmentButton" value="1">
            <IonLabel>Lånt</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      {selectedTable === "0" && !booksLoading && (
        <IonList>
          {!booksLoading && [
            <IonItem
              key="add"
              button
              detail
              onClick={() => history.push(`/my-books/add`)}
            >
              <IonLabel color="tertiary" className="addBtn">
                <IonIcon slot="start" icon={add} />
                Legg ut bok
                {/* </IonButton> */}
              </IonLabel>
            </IonItem>,
            books.length === 0 && (
              <IonItem key="noAvailable">
                <IonLabel class="ion-text-wrap">
                  Ingen tilgjengelige
                  {/* <p>{`${
                        !position
                          ? "Du må tillate posisjon for å finne bøker."
                          : ""
                      }`}</p> */}
                </IonLabel>
              </IonItem>
            ),
            books.map((book: BookType) => (
              <IonItem
                key={book.id}
                button
                onClick={() => history.push(`/my-books/edit-${book.id}`)}
                detail
              >
                <IonLabel>
                  {book.title}
                  <p>{`Av ${book.author}`}</p>
                  <p>
                    {/*  {`${
                          position &&
                          getDistanceFromLatLonInKm(
                            position.lat,
                            position.lng,
                            book.position.latitude,
                            book.position.longitude
                          )
                        } km`} */}
                  </p>
                </IonLabel>
              </IonItem>
            )),
          ]}
        </IonList>
      )}
      {selectedTable === "1" && !booksLoading && (
        <IonList>
          {!booksLoading && [
            borrowedBooks.length === 0 && (
              <IonItem key="noAvailable">
                <IonLabel class="ion-text-wrap">
                  Ingen tilgjengelige
                  {/* <p>{`${
                        !position
                          ? "Du må tillate posisjon for å finne bøker."
                          : ""
                      }`}</p> */}
                </IonLabel>
              </IonItem>
            ),
            borrowedBooks.map((book: BookType) => (
              <IonItem
                key={book.id}
                button
                onClick={() => history.push(`/my-books/republish-${book.id}`)}
                detail
              >
                <IonLabel>
                  {book.title}
                  <p>{`Av ${book.author}`}</p>
                  <p>
                    {/*  {`${
                          position &&
                          getDistanceFromLatLonInKm(
                            position.lat,
                            position.lng,
                            book.position.latitude,
                            book.position.longitude
                          )
                        } km`} */}
                  </p>
                </IonLabel>
              </IonItem>
            )),
          ]}
        </IonList>
      )}
    </IonContent>
  );
};

export default MyBooks;
