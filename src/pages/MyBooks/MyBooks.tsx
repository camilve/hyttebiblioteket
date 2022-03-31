import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import {
  IonContent,
  IonLabel,
  IonCard,
  IonList,
  IonItem,
  IonSkeletonText,
  IonIcon,
  IonFab,
  IonButton,
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./MyBooks.css";
import { useHistory } from "react-router-dom";
import { BookType } from "../../types/book";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";

const MyBooks: React.FC = () => {
  const history = useHistory();
  const [user, loading] = useAuthState(auth);
  const [books, setBooks] = useState<Array<BookType>>([]);
  const [booksLoading, setBooksLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBooks();
    if (!loading && !user) history.push("/");
  }, [user]);

  const fetchBooks = async () => {
    if (user) {
      setBooksLoading(true);
      setBooks([]);
      const _books = await bookDB.myBooks(user.uid);
      setBooks(_books);
      setBooksLoading(false);
    }
  };

  return (
    <IonContent fullscreen>
      {!booksLoading && [
        books.length === 0 && (
          <IonItem key="noAvailable">
            <IonLabel class="ion-text-wrap">
              Du har ikke lagt ut noen bøker enda.
            </IonLabel>
          </IonItem>
        ),
        books.map((book: BookType) => (
          <IonCard
            key={book.id}
            button
            onClick={() => history.push(`/my-books/edit-${book.id}`)}
          >
            <div className="bookCard">
              <IonLabel>
                <p id="bookTitle">{book.title}</p>
                <p>{`Av ${book.author}`}</p>
              </IonLabel>
            </div>
          </IonCard>
        )),
        <IonFab vertical="bottom" slot="fixed" key="fabbtn">
          <IonButton
            id="fabbutton"
            onClick={() => history.push(`/my-books/add`)}
          >
            <IonIcon icon={add} slot="start" />
            Legg til ny bok
          </IonButton>
        </IonFab>,
      ]}

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
