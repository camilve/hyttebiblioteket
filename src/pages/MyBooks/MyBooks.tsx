import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonToolbar,
  IonList,
  IonItem,
  IonSkeletonText,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./MyBooks.css";
import { useHistory } from "react-router-dom";
import { BookType } from "../../types/book";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTable } from "../../services/selectTable.actions";

const MyBooks: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const booksState = useSelector((state: any) => state.selectedTableMyBooks);
  const [user, loading] = useAuthState(auth);
  const selectedTable = booksState.selectedTable || "0";
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
            dispatch(setSelectedTable("MY_BOOKS", e.detail.value));
            /* history.push(`/my-books/${e.detail.value}`); */
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
              </IonLabel>
            </IonItem>,
            books.length === 0 && (
              <IonItem key="noAvailable">
                <IonLabel class="ion-text-wrap">
                  Du har ingen bøker som ligger ute.
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
                  <p />
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
                  Du har ingen lånte bøker.
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
                  <p></p>
                </IonLabel>
              </IonItem>
            )),
          ]}
        </IonList>
      )}
      {(booksLoading || loading) && (
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
    </IonContent>
  );
};

export default MyBooks;
