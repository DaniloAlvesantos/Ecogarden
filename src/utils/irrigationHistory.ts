import { collection, doc, getDocs, query } from "firebase/firestore";

import { db } from "../lib/firebase";
import type { Irrigations } from "../types/collection/irrigations";

export const irrigationHistory = async (gardenId: string) => {
  const ref = collection(doc(db, "garden", gardenId), "irrigations");
  const q = query(ref);
  const data = await getDocs(q);

  const history = data.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Irrigations),
  }));

  return history;
};
