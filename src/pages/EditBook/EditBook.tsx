import React, { useState, useEffect } from "react";
import * as bookDB from "../../db/repositories/books";
import * as userDB from "../../db/repositories/users";
import L from "leaflet";
import { BookType } from "../../types/book";
import { UserType } from "../../types/generalTypes";
import AddEditBookForm from "../../components/AddEditBookForm";
import { auth } from "../../db/index";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, RouteComponentProps } from "react-router-dom";
import {
  IonContent,
  IonSkeletonText,
  IonButton,
  IonAlert,
  IonIcon,
} from "@ionic/react";
import { trash } from "ionicons/icons";
/* import Skeleton from "react-loading-skeleton";
import ContentWrapper from "../components/content-wrapper"; */

interface BookDetailPageProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const EditBook: React.FC<BookDetailPageProps> = ({ match }) => {
  const history = useHistory();
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
        {/*    {book && (
          <Hidden smUp>
            <Tooltip
              title={
                book.ownership && book.ownerId !== user.uid
                  ? "Boka har eierskap, og kan derfor ikke slettes"
                  : ""
              }
            >
              <span>
                <Button
                  variant="outlined"
                  onClick={() => setDeleteDialogOpen(true)}
                  className={classes.deletebtn}
                  disabled={book.ownership && book.ownerId !== user.uid}
                >
                  Slett bok
                </Button>
              </span>
            </Tooltip>
          </Hidden>
        )} */}
        {book &&
          user &&
          (book.ownership && book.ownerId !== user.uid ? (
            <div key="content">
              <p key="owner">
                <i>{`Boka tilhører ${owner?.name}`}</i>
              </p>
            </div>
          ) : (
            <div key="content" id="trashContainer">
              <IonButton
                onClick={() => setDeleteAlert(true)}
                key="btn"
                fill="clear"
              >
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
              <IonAlert
                key="alert"
                isOpen={deleteAlert}
                onDidDismiss={() => setDeleteAlert(false)}
                /* cssClass='my-custom-class' */
                header={"Slett bok"}
                message={
                  book.ownership && book.ownerId !== user.uid
                    ? "Boka har eierskap og kan derfor ikke slettes."
                    : "Er du sikker på at du vil slette boka?"
                }
                buttons={
                  book.ownership && book.ownerId !== user.uid
                    ? [
                        {
                          text: "Lukk",
                          role: "cancel",
                          cssClass: "secondary",
                          id: "cancel-button",
                          handler: () => {
                            setDeleteAlert(false);
                          },
                        },
                      ]
                    : [
                        {
                          text: "Avbryt",
                          role: "cancel",
                          cssClass: "secondary",
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
                      ]
                }
              />
            </div>
          ))}
        {/*   <Hidden xsDown key="button">
            <Tooltip
              title={
                book.ownership && book.ownerId !== user.uid
                  ? "Boka har eierskap, og kan derfor ikke slettes"
                  : ""
              }
            >
              <span>
                <Button
                  variant="outlined"
                  onClick={() => setDeleteDialogOpen(true)}
                  className={classes.deletebtn}
                  disabled={book.ownership && book.ownerId !== user.uid}
                >
                  Slett bok
                </Button>
              </span>
            </Tooltip>
        </Hidden>,
        <Dialog
          key="dialog"
          fullWidth
          maxWidth="xs"
          open={!!deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogContent>
            <Typography variant="body1" className={classes.mb}>
              Er du sikker på at du vil slette boka?
            </Typography>
            <div className={classes.flexcontainer}>
              <Button
                variant="outlined"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Avbryt
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  bookDB
                    .deleteBook(book.id)
                    .then(() => history.push("/my-books"));
                }}
                className={classes.deletebutton}
              >
                Slett
              </Button>
            </div>
          </DialogContent>
              </Dialog>, */}

        {/*     {borrower && (
          <ContentWrapper>
            {book?.borrowed ? (
              <>
                <Typography variant="body1">{`Boka er lånt ut til ${borrower.name}.`}</Typography>
                <Typography variant="body2">{`Hvis du ikke lenger ønsker eierskap for boka kan du endre dette når som helst.`}</Typography>
              </>
            ) : (
              <>
                {book?.borrowedBy === user.uid ? (
                  <>
                    <Typography variant="body1">{`Du la ut boka sist.`}</Typography>
                    <Typography variant="body2">{`Denne tilhører ${owner?.name}.`}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body1">{`Boka ble sist lagt ut av ${borrower.name}.`}</Typography>
                    <Typography variant="body2">{`Hvis du ikke lenger ønsker oversikt over boka, kan du endre dette når som helst.`}</Typography>
                  </>
                )}
              </>
            )}
          </ContentWrapper>
      )}  */}
        {(bookLoading || loading) && <IonSkeletonText />}

        {book && user && (
          <AddEditBookForm
            edit
            borrowed={book.borrowed && book.borrowedBy !== user.uid}
            book={book}
            position={L.latLng(book.position.latitude, book.position.longitude)}
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
          />
        )}
      </div>
    </IonContent>
  );
};

export default EditBook;
