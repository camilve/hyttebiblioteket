import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// config value from add firebase sdk script that showed earlier.
const config = {
  apiKey: "AIzaSyBQLSzGjFp1QTTR-OfbnjYOcaho5_HBinU",
  authDomain: "book-sharing-c7b9b.firebaseapp.com",
  projectId: "book-sharing-c7b9b",
  storageBucket: "book-sharing-c7b9b.appspot.com",
  messagingSenderId: "634114595713",
  appId: "1:634114595713:web:f211e402d8774f55eba680",
  //measurementId: "YOUR_MEASUREMENT_ID",
};

// init app
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const signInEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
  let a = "";
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await updateProfile(user, {
      displayName: name,
    });
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    a = "";
  } catch (err: any) {
    console.error(err);
    if (err) a = err.code;
  } finally {
    return a;
  }
};
const sendPasswordReset = (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};
const logout = () => {
  auth.signOut();
};
export {
  auth,
  db,
  signInEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
