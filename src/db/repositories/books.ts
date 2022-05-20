// import db config
import { db } from "../";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  getDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { BookType } from "../../types/book";
import { geohashQueryBounds, distanceBetween } from "geofire-common";

// collection name
const COLLECTION_NAME = "books";

// retrieve all books
export const all = async (): Promise<Array<BookType>> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const data: Array<any> = [];
    snapshot.docs.map((_data) => {
      data.push({
        id: _data.id, // because id field in separate function in firestore
        ..._data.data(), // the remaining fields
      });
    });
    // return and convert back it array of todo
    return data as Array<BookType>;
  } catch (err: any) {
    console.log(err.code);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return [];
  }
};

export const allInRadius = async (
  center: [number, number],
  radius: number,
  userId: string
): Promise<Array<BookType>> => {
  const bounds = geohashQueryBounds(center, radius);
  const promises = [];
  try {
    for (const b of bounds) {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1])
      );

      promises.push(getDocs(q));
    }
    const snapshots = await Promise.all(promises);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const data: Array<any> = [];
    snapshots.map((snapshot: any) => {
      snapshot.docs.map((doc: any) => {
        const lat = doc.get("position").latitude;
        const lng = doc.get("position").longitude;

        // We have to filter out a few false positives due to GeoHash
        // accuracy, but most will match
        const distanceInKm = distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (
          distanceInM <= radius &&
          doc.get("ownerId") !== userId &&
          doc.get("borrowedBy") !== userId &&
          doc.get("borrowed") === false
        ) {
          data.push({
            id: doc.id, // because id field in separate function in firestore
            ...doc.data(), // the remaining fields
          });
        }
      });
    });
    // return and convert back it array of todo
    const sortedData = (data as Array<BookType>).sort(
      (a: BookType, b: BookType) => {
        const aLat = a.position.latitude;
        const aLng = a.position.longitude;
        const aDistanceInKm = distanceBetween([aLat, aLng], center);
        const bLat = b.position.latitude;
        const bLng = b.position.longitude;
        const bDistanceInKm = distanceBetween([bLat, bLng], center);
        return aDistanceInKm - bDistanceInKm;
      }
    );
    return sortedData as Array<BookType>;
  } catch (err: any) {
    console.log(err.code);
    console.error(err);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return [];
  }
};

export const myBooks = async (userId: string): Promise<Array<BookType>> => {
  try {
    const myBooks = query(
      collection(db, COLLECTION_NAME),
      where("ownerId", "==", userId),
      where("borrowed", "==", false)
    );
    const myBooks2 = query(
      collection(db, COLLECTION_NAME),
      where("ownerId", "==", userId),
      where("borrowedBy", "!=", userId),
      where("borrowed", "==", true)
    );

    const myBorrowedBooks = query(
      collection(db, COLLECTION_NAME),
      where("borrowedBy", "==", userId),
      where("borrowed", "==", false)
    );

    const snapshot1 = await getDocs(myBooks);
    const snapshot2 = await getDocs(myBooks2);
    const snapshot3 = await getDocs(myBorrowedBooks);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const data: Array<any> = [];
    snapshot3.docs.concat(snapshot1.docs.concat(snapshot2.docs)).map((doc) => {
      data.push({
        id: doc.id, // because id field in separate function in firestore
        ...doc.data(), // the remaining fields
      });
    });
    // return and convert back it array of todo
    return data as Array<BookType>;
  } catch (err: any) {
    console.log(err.code);
    console.error(err);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return [];
  }
};

export const myBorrowedBooks = async (
  userId: string
): Promise<Array<BookType>> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("borrowedBy", "==", userId),
      where("borrowed", "==", true)
    );

    const snapshot = await getDocs(q);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const data: Array<any> = [];
    snapshot.docs.map((doc) => {
      data.push({
        id: doc.id, // because id field in separate function in firestore
        ...doc.data(), // the remaining fields
      });
    });
    // return and convert back it array of todo
    const sortedData = (data as Array<BookType>).sort(
      (a: BookType, b: BookType) => {
        return (
          new Date(
            b.borrowedDate ||
              "Mon Mar 21 2022 12:01:06 GMT+0200 (sentraleuropeisk sommertid)"
          ).valueOf() -
          new Date(
            a.borrowedDate ||
              "Mon Mar 21 2022 12:01:06 GMT+0200 (sentraleuropeisk sommertid)"
          ).valueOf()
        );
      }
    );

    return data as Array<BookType>;
  } catch (err: any) {
    console.log(err.code);
    console.error(err);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return [];
  }
};

export const byId = async (id: string): Promise<BookType | undefined> => {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as BookType;
    } else {
      return undefined;
    }
  } catch (err: any) {
    console.log(err.code);
    console.error(err);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return;
  }
};

export const addBook = (book: BookType): Promise<unknown> => {
  return addDoc(collection(db, COLLECTION_NAME), book);
};

export const deleteBook = async (id: string): Promise<unknown> => {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateBook = async (
  bookId: string,
  newBook: BookType
): Promise<unknown> => {
  const batch = writeBatch(db);
  const bookRef = doc(db, COLLECTION_NAME, bookId);
  batch.update(bookRef, {
    title: newBook.title,
    author: newBook.author,
    published: newBook.published,
    position: newBook.position,
    comment: newBook.comment,
    ownership: newBook.ownership,
    geohash: newBook.geohash,
    borrowed: newBook.borrowed,
    borrowedBy: newBook.borrowedBy,
    ownerId: newBook.ownerId,
    borrowedDate: newBook.borrowedDate,
    prevBorrowedId: newBook.prevBorrowedId,
  });

  return batch.commit();
};
