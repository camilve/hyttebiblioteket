import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import {
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonSkeletonText,
  IonCard,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import "./Borrowed.css";
import { useHistory } from "react-router-dom";
import { BookType } from "../../types/book";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";

const Borrowed: React.FC = () => {
  const history = useHistory();
  const [user, loading] = useAuthState(auth);
  const [borrowedBooks, setBorrowedBooks] = useState<Array<BookType>>([]);
  const [booksLoading, setBooksLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBooks();
    if (!loading && !user) history.push("/");
  }, [user]);

  const fetchBooks = async () => {
    if (user) {
      setBooksLoading(true);
      setBorrowedBooks([]);
      const _borrowedBooks = await bookDB.myBorrowedBooks(user.uid);
      setBorrowedBooks(_borrowedBooks);
      setBooksLoading(false);
    }
  };

  return (
    <IonContent fullscreen>
      <IonRefresher
        closeDuration="1ms"
        slot="fixed"
        onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
          fetchBooks();
          setTimeout(() => {
            event.detail.complete();
          }, 1);
        }}
      >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      {!booksLoading && (
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
              <IonCard
                key={book.id}
                button
                onClick={() => history.push(`/borrowed/${book.id}`)}
              >
                <div className="bookCard">
                  <IonLabel>
                    <p>{`Lånt: ${
                      book.borrowedDate &&
                      new Date(book.borrowedDate).toLocaleDateString("nb-NO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    }`}</p>
                    <p id="bookTitle">{book.title}</p>
                    <p>{`Av ${book.author}`}</p>
                  </IonLabel>
                </div>
              </IonCard>
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

export default Borrowed;
