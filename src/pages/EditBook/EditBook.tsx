import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import * as userDB from "../../db/repositories/users";
import L from "leaflet";
import { BookType } from "../../types/book";
import { UserType } from "../../types/generalTypes";
import AddEditBookForm from "../../components/AddEditBookForm";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IonContent, IonSkeletonText, IonButton, IonAlert } from "@ionic/react";
import "./EditBook.css";

interface BookDetailPageProps {
  id: string;
}

const EditBook: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch<BookDetailPageProps>();
  const { id } = match.params;
  const [book, setBook] = useState<BookType | undefined>(undefined);
  const [bookLoading, setBookLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [borrower, setBorrower] = useState<UserType | undefined>(undefined);
  const [owner, setOwner] = useState<UserType | undefined>(undefined);
  const [deleteAlert, setDeleteAlert] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [user]);

  const fetchBook = async () => {
    if (user) {
      setBookLoading(true);
      setBook(undefined);
      setBorrower(undefined);
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

  const fetchUser = async (_book: BookType) => {
    if (_book && _book.borrowedBy) {
      const _user = await userDB.byId(_book.borrowedBy);
      setBorrower(_user);
      const _owner = await userDB.byId(_book.ownerId);
      setOwner(_owner);
    }
  };

  return (
    <IonContent>
      <div className="content">
        {borrower && user && (
          <>
            {book?.borrowed ? (
              <p className="bookInfoText">
                <i>
                  {`Boka er lånt ut til ${borrower.name}.
                    Hvis du ikke lenger ønsker eierskap for boka kan du endre dette når som helst.`}
                </i>
              </p>
            ) : (
              <>
                {book?.borrowedBy === user.uid ? (
                  <p className="bookInfoText">
                    <i>{`Du la ut boka sist. Boka tilhører ${owner?.name}.`}</i>
                  </p>
                ) : (
                  <p className="bookInfoText">
                    <i>
                      {`Boka ble sist lagt ut av ${borrower.name}. 
                      Hvis du ikke lenger ønsker oversikt over boka, kan du endre dette når som helst.`}
                    </i>
                  </p>
                )}
              </>
            )}
          </>
        )}
        {(bookLoading || loading) && <IonSkeletonText />}

        {book &&
          user && [
            <AddEditBookForm
              edit
              borrowed={book.borrowed && book.borrowedBy !== user.uid}
              book={book}
              position={L.latLng(
                book.position.latitude,
                book.position.longitude
              )}
              userId={user?.uid}
              onSubmit={(val) => {
                if (val.borrowed && val.borrowedBy && !val.ownership) {
                  val.ownerId = val.borrowedBy;
                }
                bookDB
                  .updateBook(id, val)
                  .then(() => {
                    history.push("/my-books");
                  })
                  .catch((e) => console.error(e));
              }}
              handleClose={() => history.push("/my-books")}
            />,
            !(book.ownership && book.ownerId !== user.uid) && (
              <div key="content" id="trashContainer">
                <IonButton
                  onClick={() => setDeleteAlert(true)}
                  key="btn"
                  fill="clear"
                  className="deletebtn"
                >
                  Slett
                </IonButton>
                <IonAlert
                  key="alert"
                  isOpen={deleteAlert}
                  onDidDismiss={() => setDeleteAlert(false)}
                  header={"Slett bok"}
                  message={"Er du sikker på at du vil slette boka?"}
                  buttons={[
                    {
                      text: "Avbryt",
                      role: "cancel",
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
                          .then(() => history.push("/my-books"));
                      },
                    },
                  ]}
                />
              </div>
            ),
          ]}
      </div>
    </IonContent>
  );
};

export default EditBook;
