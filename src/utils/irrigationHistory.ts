import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import type { Irrigations } from "../types/collection/irrigations";

export const irrigationHistory = (
  gardenId: string,
  callback: (data: Irrigations[]) => void,
) => {
  const ref = collection(doc(db, "garden", gardenId), "irrigations");

  const q = query(ref, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Irrigations),
    }));

    callback(history);
  });
};
