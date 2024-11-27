import { firebaseConfig } from "@/firebase";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);

export default function useFirebase() {
  return { app };
}
