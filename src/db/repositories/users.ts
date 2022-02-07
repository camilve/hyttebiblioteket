import { db } from "../";
import { collection, getDocs, query, where } from "firebase/firestore";
import { UserType } from "../../types/generalTypes";

// collection name
const COLLECTION_NAME = "users";

export const byId = async (id: string): Promise<UserType | undefined> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("uid", "==", id));

    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    if (doc && doc.exists()) {
      return { id: doc.id, ...doc.data() } as UserType;
    }
    return undefined;
  } catch (err: any) {
    console.log(err.code);
    console.error(err);
    if (err.code === "permission-denied") {
      window.location.href = `${window.location.origin}/`;
    }
    return;
  }
};
